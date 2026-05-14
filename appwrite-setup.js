// ═══════════════════════════════════════════════════════════════════════════════
// CIBID APPWRITE DATABASE SETUP — إعداد قاعدة البيانات
// ═══════════════════════════════════════════════════════════════════════════════
// 
// معلومات الاتصال:
// Project ID: if0_41916916
// Database ID: if0_41916916_cibod
// API Key: aboode2005555
// 
// ═══════════════════════════════════════════════════════════════════════════════

const { Client, Databases, Users, Collections, Indexes } = require('node-appwrite');

// ═══════════════════════════════════════════════════════════════════════════════
// APPWRITE CLIENT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite Cloud Endpoint
  .setProject('if0_41916916') // Project ID
  .setKey('aboode2005555'); // API Key

const databases = new Databases(client);

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DB_CONFIG = {
  databaseId: 'if0_41916916_cibod',
  collections: {
    channels: {
      name: 'channels',
      id: 'channels',
      attributes: [
        // Channel Name
        {
          type: 'string',
          id: 'name',
          required: true,
          size: 100
        },
        // Streaming URL
        {
          type: 'string',
          id: 'url',
          required: true,
          size: 2048
        },
        // Channel Logo/Image
        {
          type: 'string',
          id: 'image',
          required: false,
          size: 2048
        },
        // Channel Category
        {
          type: 'string',
          id: 'category',
          required: false,
          size: 50,
          default: 'عام'
        },
        // User ID (Creator)
        {
          type: 'string',
          id: 'userId',
          required: true,
          size: 100
        },
        // Status (active/inactive)
        {
          type: 'string',
          id: 'status',
          required: false,
          size: 20,
          default: 'active'
        },
        // View Count
        {
          type: 'integer',
          id: 'views',
          required: false,
          default: 0
        },
        // Description
        {
          type: 'string',
          id: 'description',
          required: false,
          size: 1000
        },
        // Created At
        {
          type: 'datetime',
          id: 'createdAt',
          required: true
        },
        // Updated At
        {
          type: 'datetime',
          id: 'updatedAt',
          required: true
        }
      ],
      indexes: [
        {
          type: 'key',
          id: 'idx_userId',
          attributes: ['userId'],
          orders: ['ASC']
        },
        {
          type: 'key',
          id: 'idx_category',
          attributes: ['category'],
          orders: ['ASC']
        },
        {
          type: 'key',
          id: 'idx_status',
          attributes: ['status'],
          orders: ['ASC']
        },
        {
          type: 'fulltext',
          id: 'idx_search',
          attributes: ['name', 'description']
        }
      ]
    },

    users: {
      name: 'users',
      id: 'users',
      attributes: [
        // Email
        {
          type: 'email',
          id: 'email',
          required: true,
          size: 255
        },
        // Password Hash
        {
          type: 'string',
          id: 'passwordHash',
          required: true,
          size: 255
        },
        // Username
        {
          type: 'string',
          id: 'username',
          required: false,
          size: 100
        },
        // Display Name
        {
          type: 'string',
          id: 'displayName',
          required: false,
          size: 100
        },
        // Profile Picture
        {
          type: 'string',
          id: 'profilePicture',
          required: false,
          size: 2048
        },
        // Account Status
        {
          type: 'string',
          id: 'status',
          required: false,
          size: 20,
          default: 'active'
        },
        // Email Verified
        {
          type: 'boolean',
          id: 'emailVerified',
          required: false,
          default: false
        },
        // Two Factor Enabled
        {
          type: 'boolean',
          id: 'twoFactorEnabled',
          required: false,
          default: false
        },
        // Last Login
        {
          type: 'datetime',
          id: 'lastLogin',
          required: false
        },
        // Created At
        {
          type: 'datetime',
          id: 'createdAt',
          required: true
        },
        // Updated At
        {
          type: 'datetime',
          id: 'updatedAt',
          required: true
        }
      ],
      indexes: [
        {
          type: 'unique',
          id: 'idx_email',
          attributes: ['email'],
          orders: ['ASC']
        },
        {
          type: 'key',
          id: 'idx_status',
          attributes: ['status'],
          orders: ['ASC']
        }
      ]
    },

    sessions: {
      name: 'sessions',
      id: 'sessions',
      attributes: [
        // User ID
        {
          type: 'string',
          id: 'userId',
          required: true,
          size: 100
        },
        // Session Token
        {
          type: 'string',
          id: 'token',
          required: true,
          size: 512
        },
        // IP Address
        {
          type: 'string',
          id: 'ipAddress',
          required: false,
          size: 45
        },
        // User Agent
        {
          type: 'string',
          id: 'userAgent',
          required: false,
          size: 500
        },
        // Expires At
        {
          type: 'datetime',
          id: 'expiresAt',
          required: true
        },
        // Created At
        {
          type: 'datetime',
          id: 'createdAt',
          required: true
        }
      ],
      indexes: [
        {
          type: 'key',
          id: 'idx_userId',
          attributes: ['userId'],
          orders: ['ASC']
        },
        {
          type: 'unique',
          id: 'idx_token',
          attributes: ['token'],
          orders: ['ASC']
        }
      ]
    },

    logs: {
      name: 'logs',
      id: 'logs',
      attributes: [
        // User ID
        {
          type: 'string',
          id: 'userId',
          required: false,
          size: 100
        },
        // Action Type
        {
          type: 'string',
          id: 'action',
          required: true,
          size: 50
        },
        // Resource Type
        {
          type: 'string',
          id: 'resource',
          required: false,
          size: 50
        },
        // Resource ID
        {
          type: 'string',
          id: 'resourceId',
          required: false,
          size: 100
        },
        // IP Address
        {
          type: 'string',
          id: 'ipAddress',
          required: false,
          size: 45
        },
        // Status
        {
          type: 'string',
          id: 'status',
          required: false,
          size: 20
        },
        // Details
        {
          type: 'string',
          id: 'details',
          required: false,
          size: 2000
        },
        // Created At
        {
          type: 'datetime',
          id: 'createdAt',
          required: true
        }
      ],
      indexes: [
        {
          type: 'key',
          id: 'idx_userId',
          attributes: ['userId'],
          orders: ['DESC']
        },
        {
          type: 'key',
          id: 'idx_action',
          attributes: ['action'],
          orders: ['ASC']
        }
      ]
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETUP FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function setupDatabase() {
  try {
    console.log('🔧 بدء إعداد قاعدة البيانات...\n');

    // Create Database
    console.log('📊 إنشاء قاعدة البيانات...');
    let database;
    try {
      database = await databases.get(DB_CONFIG.databaseId);
      console.log('✓ قاعدة البيانات موجودة بالفعل');
    } catch {
      database = await databases.create(DB_CONFIG.databaseId, 'CIBID Database');
      console.log('✓ تم إنشاء قاعدة البيانات');
    }

    // Create Collections
    for (const [collectionKey, collectionConfig] of Object.entries(DB_CONFIG.collections)) {
      console.log(`\n📋 إنشاء Collection: ${collectionConfig.name}`);

      let collection;
      try {
        collection = await databases.getCollection(DB_CONFIG.databaseId, collectionConfig.id);
        console.log(`  ✓ Collection موجودة بالفعل`);
      } catch {
        collection = await databases.createCollection(
          DB_CONFIG.databaseId,
          collectionConfig.id,
          collectionConfig.name,
          ['read("any")', 'write("authenticated")']
        );
        console.log(`  ✓ تم إنشاء Collection`);
      }

      // Add Attributes
      console.log(`  📝 إضافة الحقول...`);
      for (const attr of collectionConfig.attributes) {
        try {
          await databases.getAttribute(
            DB_CONFIG.databaseId,
            collectionConfig.id,
            attr.id
          );
          console.log(`    • ${attr.id} ✓`);
        } catch {
          let createAttrPromise;
          
          if (attr.type === 'string') {
            createAttrPromise = databases.createStringAttribute(
              DB_CONFIG.databaseId,
              collectionConfig.id,
              attr.id,
              attr.size,
              attr.required,
              attr.default
            );
          } else if (attr.type === 'email') {
            createAttrPromise = databases.createEmailAttribute(
              DB_CONFIG.databaseId,
              collectionConfig.id,
              attr.id,
              attr.required,
              attr.default
            );
          } else if (attr.type === 'integer') {
            createAttrPromise = databases.createIntegerAttribute(
              DB_CONFIG.databaseId,
              collectionConfig.id,
              attr.id,
              attr.required,
              attr.default
            );
          } else if (attr.type === 'boolean') {
            createAttrPromise = databases.createBooleanAttribute(
              DB_CONFIG.databaseId,
              collectionConfig.id,
              attr.id,
              attr.required,
              attr.default
            );
          } else if (attr.type === 'datetime') {
            createAttrPromise = databases.createDatetimeAttribute(
              DB_CONFIG.databaseId,
              collectionConfig.id,
              attr.id,
              attr.required,
              attr.default
            );
          }

          if (createAttrPromise) {
            await createAttrPromise;
            console.log(`    • ${attr.id} ✓`);
          }
        }
      }

      // Add Indexes
      if (collectionConfig.indexes && collectionConfig.indexes.length > 0) {
        console.log(`  🔑 إضافة الفهارس...`);
        for (const index of collectionConfig.indexes) {
          try {
            await databases.getIndex(
              DB_CONFIG.databaseId,
              collectionConfig.id,
              index.id
            );
            console.log(`    • ${index.id} ✓`);
          } catch {
            if (index.type === 'key') {
              await databases.createIndex(
                DB_CONFIG.databaseId,
                collectionConfig.id,
                index.id,
                index.type,
                index.attributes,
                index.orders
              );
            } else if (index.type === 'unique') {
              await databases.createIndex(
                DB_CONFIG.databaseId,
                collectionConfig.id,
                index.id,
                index.type,
                index.attributes,
                index.orders
              );
            } else if (index.type === 'fulltext') {
              await databases.createIndex(
                DB_CONFIG.databaseId,
                collectionConfig.id,
                index.id,
                index.type,
                index.attributes
              );
            }
            console.log(`    • ${index.id} ✓`);
          }
        }
      }
    }

    console.log('\n✅ تم إعداد قاعدة البيانات بنجاح!');
    console.log('\n📊 ملخص القاعدة:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Project ID: if0_41916916`);
    console.log(`Database ID: ${DB_CONFIG.databaseId}`);
    console.log(`Collections: ${Object.keys(DB_CONFIG.collections).length}`);
    Object.keys(DB_CONFIG.collections).forEach(key => {
      console.log(`  • ${DB_CONFIG.collections[key].name}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error.message);
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  client,
  databases,
  DB_CONFIG,
  setupDatabase
};

// ═══════════════════════════════════════════════════════════════════════════════
// RUN SETUP (if executed directly)
// ═══════════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  setupDatabase().catch(console.error);
}
