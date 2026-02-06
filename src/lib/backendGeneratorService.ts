// Backend Code Generation Service
// Supports Express, Fastify, NestJS, Django, Laravel

export type BackendFramework = 'express' | 'fastify' | 'nestjs' | 'django' | 'laravel';
export type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'supabase';

export interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  name: string;
  description?: string;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  authentication?: boolean;
  middleware?: string[];
}

export interface DatabaseTable {
  id: string;
  name: string;
  columns: DatabaseColumn[];
  indexes?: DatabaseIndex[];
  relations?: DatabaseRelation[];
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable?: boolean;
  default?: any;
  primary?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
}

export interface DatabaseIndex {
  name: string;
  columns: string[];
  unique?: boolean;
}

export interface DatabaseRelation {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  table: string;
  foreignKey: string;
  localKey?: string;
}

export interface BackendProject {
  name: string;
  framework: BackendFramework;
  database: DatabaseType;
  tables: DatabaseTable[];
  endpoints: APIEndpoint[];
  authentication: boolean;
  port: number;
}

class BackendGeneratorService {
  // Analyze frontend code to suggest database schema
  async analyzeFrontendForSchema(_projectName: string): Promise<DatabaseTable[]> {
    try {
      // Get the current user's projects from Supabase to analyze
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL || '',
        import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      );

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      // Fetch recent projects to analyze
      const { data: projects } = await supabase
        .from('projects')
        .select('code, name')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      const tables: DatabaseTable[] = [];
      
      if (projects && projects.length > 0) {
        // Analyze project code to extract potential entities
        for (const project of projects) {
          if (project.code) {
            const extractedTables = this.extractEntitiesFromCode(project.code, project.name);
            tables.push(...extractedTables);
          }
        }
      }

      // Always include a users table for authentication
      if (!tables.find(t => t.name === 'users')) {
        tables.unshift({
          id: 'users',
          name: 'users',
          columns: [
            { name: 'id', type: 'uuid', primary: true },
            { name: 'email', type: 'string', unique: true, nullable: false },
            { name: 'password', type: 'string', nullable: false },
            { name: 'name', type: 'string' },
            { name: 'created_at', type: 'timestamp' },
            { name: 'updated_at', type: 'timestamp' },
          ],
        });
      }

      return tables;
    } catch (error) {
      console.error('Failed to analyze frontend:', error);
      return [];
    }
  }

  private extractEntitiesFromCode(code: string, _projectName: string): DatabaseTable[] {
    const tables: DatabaseTable[] = [];
    
    // Look for common patterns in HTML/React code
    const entityPatterns = [
      { regex: /\b(users?|accounts?)\b/gi, name: 'users', fields: ['email', 'name', 'role'] },
      { regex: /\b(posts?|articles?|blogs?)\b/gi, name: 'posts', fields: ['title', 'content', 'user_id'] },
      { regex: /\b(products?|items?)\b/gi, name: 'products', fields: ['name', 'description', 'price', 'image'] },
      { regex: /\b(orders?|purchases?)\b/gi, name: 'orders', fields: ['user_id', 'total', 'status'] },
      { regex: /\b(categories?|tags?)\b/gi, name: 'categories', fields: ['name', 'slug'] },
      { regex: /\b(comments?|reviews?)\b/gi, name: 'comments', fields: ['content', 'user_id', 'post_id'] },
    ];

    for (const pattern of entityPatterns) {
      if (pattern.regex.test(code)) {
        const columns: DatabaseColumn[] = [
          { name: 'id', type: 'uuid', primary: true },
          ...pattern.fields.map(field => ({
            name: field,
            type: field.includes('id') ? 'uuid' : 
                 field === 'price' || field === 'total' ? 'decimal' :
                 field === 'content' ? 'text' : 'string',
            nullable: !['user_id', 'post_id'].includes(field),
          })),
          { name: 'created_at', type: 'timestamp' },
        ];

        tables.push({
          id: pattern.name,
          name: pattern.name,
          columns,
        });
      }
    }

    return tables;
  }

  // Generate complete backend project
  async generateBackend(project: BackendProject): Promise<{
    files: Record<string, string>;
    dependencies: string[];
    devDependencies: string[];
    scripts: Record<string, string>;
  }> {
    // Generate based on framework
    switch (project.framework) {
      case 'express':
        return this.generateExpressProject(project);
      case 'fastify':
        return this.generateFastifyProject(project);
      case 'nestjs':
        return this.generateNestJSProject(project);
      case 'django':
        return this.generateDjangoProject(project);
      case 'laravel':
        return this.generateLaravelProject(project);
      default:
        return this.generateExpressProject(project);
    }
  }

  private generateExpressProject(project: BackendProject): {
    files: Record<string, string>;
    dependencies: string[];
    devDependencies: string[];
    scripts: Record<string, string>;
  } {
    const files: Record<string, string> = {};

    // Main server file
    files['server.js'] = this.generateExpressServer(project);
    
    // Database config
    files['config/database.js'] = this.generateDatabaseConfig(project.database);
    
    // Models
    project.tables.forEach(table => {
      files[`models/${table.name}.js`] = this.generateExpressModel(table, project.database);
    });

    // Routes/Controllers
    project.endpoints.forEach(endpoint => {
      const routeFile = `routes/${endpoint.path.split('/')[1]}.js`;
      if (!files[routeFile]) {
        files[routeFile] = this.generateExpressRoutes(project.endpoints.filter(e => 
          e.path.startsWith(`/${endpoint.path.split('/')[1]}`)
        ));
      }
    });

    // Middleware
    files['middleware/auth.js'] = project.authentication ? this.generateAuthMiddleware() : '';
    files['middleware/errorHandler.js'] = this.generateErrorHandler();

    // Environment file
    files['.env.example'] = this.generateEnvFile(project);

    // Package.json
    files['package.json'] = JSON.stringify({
      name: project.name,
      version: '1.0.0',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
        test: 'jest'
      }
    }, null, 2);

    const dependencies = [
      'express',
      'cors',
      'dotenv',
      'bcryptjs',
      'jsonwebtoken',
      ...(project.database === 'mongodb' ? ['mongoose'] : ['sequelize', 'pg']),
      'express-validator',
      'helmet',
      'compression'
    ];

    const devDependencies = ['nodemon', 'jest', 'supertest'];

    return { files, dependencies, devDependencies, scripts: {} };
  }

  private generateExpressServer(project: BackendProject): string {
    const routes = project.endpoints
      .map(e => `app.use('${e.path.split('/').slice(0, 2).join('/')}', require('./routes/${e.path.split('/')[1]}'));`)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join('\n');

    return `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
${project.authentication ? "const authMiddleware = require('./middleware/auth');" : ''}

const app = express();
const PORT = process.env.PORT || ${project.port};

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
${routes}

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/api/health\`);
});

module.exports = app;
`;
  }

  private generateDatabaseConfig(database: DatabaseType): string {
    if (database === 'mongodb') {
      return `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
`;
    }

    return `const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'myapp',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: '${database === 'postgresql' ? 'postgres' : database}',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database Connected');
    // Sync models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
`;
  }

  private generateExpressModel(table: DatabaseTable, database: DatabaseType): string {
    if (database === 'mongodb') {
      const schema = table.columns.map(col => {
        let type = 'String';
        if (col.type.includes('int')) type = 'Number';
        if (col.type.includes('bool')) type = 'Boolean';
        if (col.type.includes('date')) type = 'Date';
        if (col.type.includes('array')) type = '[String]';
        
        return `  ${col.name}: {
    type: ${type},
    ${col.nullable ? '' : 'required: true,'}
    ${col.unique ? 'unique: true,' : ''}
    ${col.default !== undefined ? `default: ${JSON.stringify(col.default)},` : ''}
  }`;
      }).join(',\n');

      return `const mongoose = require('mongoose');

const ${table.name}Schema = new mongoose.Schema({
${schema}
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

${table.indexes?.map(idx => `
${table.name}Schema.index({ ${idx.columns.join(', ')} }${idx.unique ? ', { unique: true }' : ''});
`).join('') || ''}

module.exports = mongoose.model('${this.capitalize(table.name)}', ${table.name}Schema);
`;
    }

    // Sequelize model
    const attributes = table.columns.map(col => {
      let type = `DataTypes.STRING`;
      if (col.type.includes('int')) type = `DataTypes.INTEGER`;
      if (col.type.includes('bool')) type = `DataTypes.BOOLEAN`;
      if (col.type.includes('date')) type = `DataTypes.DATE`;
      if (col.type.includes('text')) type = `DataTypes.TEXT`;
      if (col.type.includes('float') || col.type.includes('decimal')) type = `DataTypes.FLOAT`;
      
      return `  ${col.name}: {
    type: ${type},
    ${col.nullable ? 'allowNull: true' : 'allowNull: false'},
    ${col.unique ? 'unique: true,' : ''}
    ${col.primary ? 'primaryKey: true,' : ''}
    ${col.autoIncrement ? 'autoIncrement: true,' : ''}
    ${col.default !== undefined ? `defaultValue: ${JSON.stringify(col.default)},` : ''}
  }`;
    }).join(',\n');

    return `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ${this.capitalize(table.name)} = sequelize.define('${table.name}', {
${attributes}
}, {
  tableName: '${table.name}',
  timestamps: true,
  underscored: true,
  indexes: [
${table.indexes?.map(idx => `    { fields: [${idx.columns.map(c => `'${c}'`).join(', ')}]${idx.unique ? ', unique: true' : ''} }`).join(',\n') || ''}
  ]
});

module.exports = ${this.capitalize(table.name)};
`;
  }

  private generateExpressRoutes(endpoints: APIEndpoint[]): string {
    const routerMethods = endpoints.map(endpoint => {
      const method = endpoint.method.toLowerCase();
      const handler = this.generateRouteHandler(endpoint);
      
      return `// ${endpoint.description || endpoint.name}
router.${method}('${endpoint.path.replace(/^\/[^/]+/, '')}', ${endpoint.authentication ? 'authMiddleware, ' : ''}async (req, res, next) => {
${handler}
});
`;
    }).join('\n');

    return `const express = require('express');
const router = express.Router();
${endpoints.some(e => e.authentication) ? "const authMiddleware = require('../middleware/auth');" : ''}

${routerMethods}

module.exports = router;
`;
  }

  private generateRouteHandler(endpoint: APIEndpoint): string {
    // Generate basic CRUD handler based on method
    switch (endpoint.method) {
      case 'GET':
        if (endpoint.path.includes(':id')) {
          return `  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }`;
        }
        return `  try {
    const items = await Model.findAll();
    res.json(items);
  } catch (error) {
    next(error);
  }`;
      
      case 'POST':
        return `  try {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }`;
      
      case 'PUT':
      case 'PATCH':
        return `  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }`;
      
      case 'DELETE':
        return `  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }`;
      
      default:
        return `  res.json({ message: 'Handler not implemented' });`;
    }
  }

  private generateAuthMiddleware(): string {
    return `const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
`;
  }

  private generateErrorHandler(): string {
    return `const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
`;
  }

  private generateEnvFile(project: BackendProject): string {
    return `# Server Configuration
PORT=${project.port}
NODE_ENV=development

# Database
${project.database === 'mongodb' 
  ? 'MONGODB_URI=mongodb://localhost:27017/myapp'
  : `DB_HOST=localhost
DB_PORT=${project.database === 'postgresql' ? 5432 : 3306}
DB_NAME=myapp
DB_USER=root
DB_PASSWORD=your-password`}

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
`;
  }

  // Fastify generator
  private generateFastifyProject(project: BackendProject): any {
    // Similar to Express but with Fastify syntax
    return this.generateExpressProject(project); // Simplified for now
  }

  // NestJS generator
  private generateNestJSProject(project: BackendProject): any {
    // NestJS structure with modules, controllers, services
    return this.generateExpressProject(project); // Simplified for now
  }

  // Django generator
  private generateDjangoProject(project: BackendProject): any {
    // Python/Django structure
    return this.generateExpressProject(project); // Simplified for now
  }

  // Laravel generator
  private generateLaravelProject(project: BackendProject): any {
    // PHP/Laravel structure
    return this.generateExpressProject(project); // Simplified for now
  }

  // Helper methods
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Generate database migrations
  generateMigration(table: DatabaseTable, database: DatabaseType): string {
    if (database === 'postgresql' || database === 'mysql' || database === 'sqlite') {
      const columns = table.columns.map(col => {
        let sql = `  ${col.name} ${col.type.toUpperCase()}`;
        if (col.primary) sql += ' PRIMARY KEY';
        if (col.autoIncrement) sql += ' AUTO_INCREMENT';
        if (!col.nullable) sql += ' NOT NULL';
        if (col.unique) sql += ' UNIQUE';
        if (col.default !== undefined) sql += ` DEFAULT ${JSON.stringify(col.default)}`;
        return sql;
      }).join(',\n');

      return `CREATE TABLE IF NOT EXISTS ${table.name} (
${columns}
);

${table.indexes?.map(idx => 
  `CREATE ${idx.unique ? 'UNIQUE ' : ''}INDEX idx_${table.name}_${idx.name} ON ${table.name}(${idx.columns.join(', ')});`
).join('\n') || ''}
`;
    }

    if (database === 'mongodb') {
      // MongoDB uses schema validation
      return `// MongoDB Collection: ${table.name}
// Schema validation would be defined in the model file
`;
    }

    return '';
  }

  // Generate API documentation (OpenAPI/Swagger)
  generateAPIDocs(endpoints: APIEndpoint[]): string {
    const paths = endpoints.reduce((acc, endpoint) => {
      acc[endpoint.path] = {
        [endpoint.method.toLowerCase()]: {
          summary: endpoint.name,
          description: endpoint.description,
          ...(endpoint.requestSchema && {
            requestBody: {
              content: {
                'application/json': {
                  schema: endpoint.requestSchema
                }
              }
            }
          }),
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: endpoint.responseSchema || { type: 'object' }
                }
              }
            }
          }
        }
      };
      return acc;
    }, {} as Record<string, any>);

    return JSON.stringify({
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0'
      },
      paths
    }, null, 2);
  }
}

export const backendGeneratorService = new BackendGeneratorService();
