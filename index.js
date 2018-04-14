const express = require('express')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const app = express()
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => res.send('Hello World!'))

app.put('/upload', upload.single('file'), (req, res) => {
  fs.renameSync(req.file.path, `uploads/${req.file.originalname}`);

  return res.status(200).send(req.file);
});

app.get('/static/:image', async (req, res) => {
  let file = path.join(`uploads/${req.params.image}`);

  const type = mime.getType(path.extname(file).slice(1)) || 'text/plain';

  const s = fs.createReadStream(file);
  s.on('open', () => {
    res.header('Content-Disposition');
    res.set('Content-Type', type);
    s.pipe(res);
  });
  s.on('error', () => {
    res.set('Content-Type', 'text/plain');
    res.status(404).end('Not found');
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
