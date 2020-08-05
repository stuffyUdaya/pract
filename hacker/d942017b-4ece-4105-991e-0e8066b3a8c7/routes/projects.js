var data = require('../data-store');
var projects = data.getProjects();
var router = require('express').Router();

router.get('/', function(req, res, next) {
    const result = projects.sort((a,b) => (a.id > b.id) ? 1 : -1);
    res.status(200).json(result);
    return;
  });
  router.get('/active', function(req, res, next) {
 const result = projects.filter((a) => a.isActive);
if(result.length === 0){res.status(200).json(result); return;}
const final = result.sort((a,b) => (a.id > b.id) ? 1 : -1);
 res.status(200).json(final);
return;
});
  router.get('/:id', function(req, res, next) {
      const id = req.params.id;
     const result = projects.find((a) => a.id == id);     
    if(!result){res.status(404).json({message:"No Project Found"}); return;}
     res.status(200).json(result);
    return;
  });
  
  
  


module.exports = router;
