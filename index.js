const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const { default: mongoose } = require('mongoose')
const { marked } = require('marked')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


mongoose.connect('mongodb://localhost:27017/markdown-notetaking-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


const NoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
})

const Note = mongoose.model('Note', NoteSchema)

app.get('/list', async (req, res) => {
    try {
        const notes = await Note.find()
        return res.json(notes)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

app.post('/check', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "Content can't be empty" }) 
        }
        const response = await axios.post("https://api.languagetool.org/v2/check", null, {
            params: {
                text: content,
                language: "en-US",
            },
        });
        const matchesLength = response.data?.matches?.length   

        if(matchesLength > 0){
            return res.status(409).json({ message: "Please correct your Content", details : response.data }); 
        } else {
            return res.status(200).json({ message: "OK" }); 
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/add', async (req, res) => {
    try {
        const { title, content } = req.body;
 

        if (!title || !content) {
            return res.status(400).json({ message: "Title and Content can't be empty" }) 
        }

        if (content.length < 10 || content.length > 2000) {
            return res.status(400).json({ message: "Content Should be between 10 to 2000 characters" }) 
        }

        const response = await axios.post("https://api.languagetool.org/v2/check", null, {
            params: {
                text: content,
                language: "en-US",
            },
        });


        const matchesLength = response.data?.matches?.length   

        if(matchesLength > 0){
            res.status(409).json({ message: "Please correct your Content, it has some gramatical mistakes in it." });
            return;
        }

        const doesExists = await Note.findOne({ title: title.trim() })

        if (doesExists) {
            res.status(409).json({ message: 'Already exists with same title' });
            return;
        }


        const note = await Note.create({
            title,
            content,
            createdAt: Date.now()
        })

        await note.save()

        return res.json({ message: 'Saved Successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


app.post('/md-to-html', (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ message: "Markdown content is required" })
            return;
        }
        const htmlContent = marked(content); 
        return res.json({ html: htmlContent }); 
    } catch(error) {
        res.status(500).json({message : error.message})
    }
})


app.listen(5000, () => {
    console.log('Running on 5000')
})