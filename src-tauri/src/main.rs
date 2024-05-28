// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{params, Connection, Result};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn setup_database() -> Result<()> {
    let conn = Connection::open("lucky.db3")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  tag TEXT,
                  avatar_url TEXT,
                  luck INTEGER DEFAULT 1
                  )",
        params![],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS lottery (
                  id INTEGER PRIMARY KEY,
                  type TEXT NOT NULL,
                  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  result TEXT
                  )",
        params![],
    )?;

    Ok(())
}

fn main() {
    // set up the database
    match setup_database() {
        Ok(_) => println!("Database setup successfully."),
        Err(e) => println!("Database setup failed: {}", e),
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, read_candidates])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_candidates() -> Result<Vec<String>, String> {
    use std::fs::File;
    use std::io::{self, BufRead};
    use std::path::Path;

    let path = Path::new("candidates.txt");
    let display = path.display();

    let file = match File::open(&path) {
        Err(why) => return Err(format!("couldn't open {}: {}", display, why)),
        Ok(file) => file,
    };

    let reader = io::BufReader::new(file);

    let mut candidates = Vec::new();
    for line in reader.lines() {
        match line {
            Ok(candidate) => candidates.push(candidate),
            Err(why) => return Err(format!("couldn't read {}: {}", display, why)),
        }
    }

    Ok(candidates)
}