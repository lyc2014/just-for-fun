const express = require('express');
const path = require('path')

const app = express();
const port = 3000;

app.get('/captcha/:filename/bg', (req, res) => {
  const filename =  req.params.filename
  const bgPath = path.resolve(__dirname, `./captchaImg/${filename}.png`);
  res.sendFile(bgPath);
})
app.get('/captcha/:filename/block', (req, res) => {
  const filename =  req.params.filename
  const blockPath = path.resolve(__dirname, `./captchaImg/${filename}.png`);
  res.sendFile(blockPath);
})
app.get('/captcha', async (req, res) => {
  try {
      res.json({
          x: 182,
          y: 302,
          bgUrl: `/captcha/bg_182_302/bg`, 
          blockUrl: `/captcha/block_182_302/block` 
      });
  } catch (error) {
      console.error('Error creating captcha:', error);
      res.status(500).json({ error: 'Failed to create captcha' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});