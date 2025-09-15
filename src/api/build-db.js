const fs = require('fs');
const path = require('path');

// Read individual data files
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf8'));
const lookupItemsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/lookupItems.json'), 'utf8'));
const settingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/settings.json'), 'utf8'));
const navigationData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/navigation.json'), 'utf8'));
const breadcrumbData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/breadcrumb.json'), 'utf8'));
const notificationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/notifications.json'), 'utf8'));

// Create the combined database
const db = {
  users: usersData,
  lookupItems: lookupItemsData,
  generalSettings: [settingsData.generalSettings],
  userPreferences: [settingsData.userPreferences], 
  securitySettings: [settingsData.securitySettings],
  systemInformation: [settingsData.systemInformation],
  navigation: navigationData,
  breadcrumb: breadcrumbData,
  notifications: notificationsData,
  'individual-notifications': notificationsData[0]?.notifications || [],
  'notification-settings': notificationsData[0]?.settings || {}
};

// Write the combined database
fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));

console.log('✅ Database built successfully from separate files');
console.log(`📊 Users: ${usersData.length} records`);
console.log(`📊 Lookup Items: ${lookupItemsData.length} records`);
console.log(`📊 Settings: 4 categories (General, Preferences, Security, System)`);
console.log(`📊 Navigation: ${navigationData.length} configuration(s)`);
console.log(`📊 Breadcrumb: ${breadcrumbData.length} configuration(s)`);
console.log(`📊 Notifications: ${notificationsData.length} configuration(s)`);
console.log(`📊 Individual Notifications: ${notificationsData[0]?.notifications?.length || 0} records`);
console.log(`📊 Notification Settings: ${Object.keys(notificationsData[0]?.settings || {}).length} settings`);