const Sequelize = require('sequelize');
const rgx = new RegExp(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
const match = process.env.DATABASE_URL ? process.env.DATABASE_URL.match(rgx) : 'postgres://sfqhmrafrkbhtv:13982b6761d82dd561bbd73412a200da2e524576c0d1ccaa1021e78ae55826ee@ec2-184-73-206-155.compute-1.amazonaws.com:5432/dakhcnq9ooo322'.match(rgx);


// db.query('CREATE DATABASE IF NOT EXISTS messages').then(() => console.log('Database created'));

db = new Sequelize(match[5], match[1], match[2], {
  dialect:  'postgres',
  protocol: 'postgres',
  port:     match[4],
  host:     match[3],
  logging: false,
  dialectOptions: {
    ssl: true
  }
});

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = db.define('users', {
  //id is already created by default as PK
  username: {type: Sequelize.STRING, unique: true},
  hash: Sequelize.STRING,
  salt: Sequelize.STRING,
  account_type: Sequelize.STRING,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING
})

User.associate = (models) => {
  Todo.hasMany(models.Submission, {
    foreignKey: 'userId',
    as: 'submissions',
  });
};


const Submission = db.define('submissions', {
  //id (PK), createdAt, and user id (FK) are created by default
  user_message: Sequelize.TEXT,
  user_contact: Sequelize.TEXT,
  user_urgency: Sequelize.INTEGER,
  admin_response: Sequelize.TEXT,
  //Sequelize Boolean will be converted to TINYINT(1)
  admin_complete: Sequelize.BOOLEAN,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING
})

//define 1:many relationship of Users:Submissions
Submission.belongsTo(User);
User.hasMany(Submission, {
  foreignKey: 'userId',
  allowNull: false
});

//create tables if they do not yet exist
User.sync();
Submission.sync();

exports.User = User;
exports.Submission = Submission;