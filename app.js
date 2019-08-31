const bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	expressSanitizer = require('express-sanitizer'),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express();

// APP CONFIG
mongoose.connect('mongodb://localhost/mobinfo', { useNewUrlParser: true, useFindAndModify: false });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// MONGOOSE & MODEL CONFIG
let mobinfoSchema = new mongoose.Schema({
	model: String,
	image: String,
	price: String,
	body: String,
	posted: { type: Date, default: Date.now }
});

let Mobinfo = mongoose.model('Mobinfo', mobinfoSchema);

// RESTFUL ROUTES
app.get('/', (req, res) => {
	res.redirect('/phones');
});

// INDEX ROUTE
app.get('/phones', (req, res) => {
	//GET ALL THE DATA FROM THE DB
	Mobinfo.find({}, (err, phones) => {
		if (err) {
			console.log(err);
		} else {
			// PASS IT TO THE INDEX.EJS & RENDER IT
			res.render('index', { phones: phones });
		}
	});
});

//NEW ROUTE
app.get('/phones/new', (req, res) => {
	res.render('new');
});

//CREATE ROUTE
app.post('/phones', (req, res) => {
	req.body.phone.body = req.sanitize(req.body.phone.body);
	Mobinfo.create(req.body.phone, (err, newPhone) => {
		if (err) {
			console.log(err);
			// res.render('new');
		} else {
			// REDIRECT TO INDEX
			res.redirect('/phones');
		}
	});
});

// SHOW PAGE
app.get('/phones/:id', (req, res) => {
	Mobinfo.findById(req.params.id, (err, foundPhone) => {
		if (err) {
			res.redirect('/phones');
		} else {
			res.render('show', { phone: foundPhone });
		}
	});
});

// EDIT ROUTE
app.get('/phones/:id/edit', (req, res) => {
	Mobinfo.findById(req.params.id, (err, foundPhone) => {
		if (err) {
			res.redirect('/phones');
		} else {
			res.render('edit', { phone: foundPhone });
		}
	});
});

// UPDATE ROUTE
app.put('/phones/:id', (req, res) => {
	req.body.phone.body = req.sanitize(req.body.phone.body);
	Mobinfo.findByIdAndUpdate(req.params.id, req.body.phone, (err, updatedPhone) => {
		if (err) {
			res.redirect('/phones');
		} else {
			res.redirect('/phones/' + req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete('/phones/:id', (req, res) => {
	Mobinfo.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/phones');
		} else {
			res.redirect('/phones');
		}
	});
});

app.listen(3000, () => {
	console.log('Node server started');
});
