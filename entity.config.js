// This is a JavaScript file (not TypeScript) to avoid import issues
const path = require('path');

// Export a function that returns the entity paths
module.exports = {
  getEntityPaths: function() {
    return [
      path.join(__dirname, 'src', 'entities', '*.entity.{ts,js}')
    ];
  }
};