const { pool } = require('./config/database');

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');

    // Drop existing tables
    await pool.query('DROP TABLE IF EXISTS comments CASCADE');
    await pool.query('DROP TABLE IF EXISTS bosses CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✅ Dropped existing tables');

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created users table');

    // Create bosses table
    await pool.query(`
      CREATE TABLE bosses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        short_description TEXT NOT NULL,
        lore TEXT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created bosses table');

    // Create comments table
    await pool.query(`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        boss_id INTEGER NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created comments table');

    // Create indexes
    await pool.query('CREATE INDEX idx_comments_boss_id ON comments(boss_id)');
    await pool.query('CREATE INDEX idx_comments_user_id ON comments(user_id)');
    await pool.query('CREATE INDEX idx_users_email ON users(email)');
    console.log('✅ Created indexes');

    // Insert seed data
    await pool.query(`
      INSERT INTO bosses (name, short_description, lore, image_url) VALUES
      (
        'Artorias el Caminante del Abismo',
        'Un caballero legendario corrompido por el Abismo',
        'Sir Artorias fue uno de los Cuatro Caballeros de Gwyn, los caballeros comandantes del Señor Gwyn. Vestía una armadura azul real y blandía su Gran Espada y Gran Escudo con vigor. Artorias tenía una voluntad de acero inquebrantable, que tanto ayudó como alimentó su indomable orgullo como caballero. Durante su vida, fue conocido por matar a los Espectros Oscuros e incluso derrotó al Abismo mismo. Sin embargo, cuando viajó a Oolacile para rescatar a la Princesa Dusk, fue abrumado por las criaturas del Abismo. Para proteger a su leal compañero Sif, le dio al lobo su Gran Escudo y fue consumido por el Abismo. Ahora vaga como un cascarón corrompido de su antiguo ser, atacando a todos los que se atreven a entrar en su dominio.',
        'https://preview.redd.it/knight-artorias-is-so-well-designed-v0-pbfg4zbzwphd1.jpeg?width=640&crop=smart&auto=webp&s=63659a9a119bbf8cd5b63e9a4b16249eb943d73b'
      ),
      (
        'Ornstein y Smough',
        'Los guardias reales de Anor Londo',
        'El Asesino de Dragones Ornstein y el Verdugo Smough son los guardianes finales de la catedral de Anor Londo. Ornstein fue uno de los caballeros más confiables del Señor Gwyn y el líder de los Cuatro Caballeros de Gwyn. Le fue otorgada un alma especial y un anillo por el Señor de la Luz Solar. Smough, por otro lado, fue el último caballero que quedó para guardar la catedral. Era conocido por su tamaño inmenso y sus brutales ejecuciones. El dúo fue dejado para guardar la ilusión de Gwynevere y probar a aquellos que buscaban una audiencia con la Princesa de la Luz Solar. Sus estilos de lucha contrastantes - los ataques de lanza rápidos como el rayo de Ornstein y los devastadores golpes de martillo de Smough - los convierten en uno de los encuentros más desafiantes en Lordran.',
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fco.pinterest.com%2Fpin%2F643733340464411393%2F&psig=AOvVaw2aBf2yVFweeDW7_Z7t6nVc&ust=1762842247345000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMiq3q_55pADFQAAAAAdAAAAABAE'
      ),
      (
        'Gwyn, Señor de la Ceniza',
        'El dios caído que vinculó la Primera Llama',
        'El Señor Gwyn fue el Señor de la Luz Solar y la figura central de la Era del Fuego. Descubrió el Alma del Señor dentro de la Primera Llama y usó su poder para derrotar a los Dragones Eternos junto con sus caballeros y aliados. Gwyn gobernó sobre Anor Londo con su familia y caballeros, estableciendo la Era del Fuego y el camino de los dioses. Sin embargo, cuando la Primera Llama comenzó a desvanecerse, amenazando con sumergir al mundo en una Era de Oscuridad, Gwyn hizo el sacrificio final. Se vinculó a sí mismo a la Primera Llama para prolongar la Era del Fuego, quemando su alma como leña. Ahora, existe como un cascarón hueco de su antigua gloria, el Señor de la Ceniza, atado para siempre a defender el Horno de la Primera Llama de aquellos que desafiarían el fuego que se desvanece.',
        'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=800&q=80'
      ),
      (
        'Sif, el Gran Lobo Gris',
        'El leal compañero de Artorias',
        'Sif es un Gran Lobo Gris que guarda la tumba de su antiguo maestro, el Caballero Artorias. Esta noble bestia blande la Gran Espada de Artorias en su boca para repeler a cualquiera que se atreva a perturbar la santidad del lugar de descanso de su maestro. Hace mucho tiempo, Sif acompañó a Artorias a Oolacile para rescatar a la Princesa Dusk del Abismo. Cuando Artorias fue consumido por la oscuridad, le dio su Gran Escudo a Sif para proteger al lobo del mismo destino. Sif logró escapar y desde entonces ha permanecido leal a su maestro caído, montando guardia sobre su tumba en el Jardín de la Raíz Oscura. La lealtad inquebrantable del lobo y su trágica historia hacen de este uno de los encuentros más emocionalmente desafiantes en Dark Souls, ya que los jugadores deben enfrentar a una criatura que lucha solo para honrar y proteger la memoria de un héroe caído.',
        'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80'
      )
    `);
    console.log('✅ Inserted seed data');

    const result = await pool.query('SELECT COUNT(*) FROM bosses');
    console.log(`✅ Database initialized successfully with ${result.rows[0].count} bosses`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
