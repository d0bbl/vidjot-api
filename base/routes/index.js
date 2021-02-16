const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    app: 'Idea App..',
    status: 'ok',
  });
});

module.exports = router;
