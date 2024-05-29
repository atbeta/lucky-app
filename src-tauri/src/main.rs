// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{params, Connection, Result};
use std::fs::OpenOptions;
use std::io::prelude::*;
use std::fs::File;
use std::path::Path;


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
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, read_candidates, read_or_create_config, save_config])
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

#[tauri::command]
fn read_or_create_config() -> Result<String, String> {
    let path = "config.json";

    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open(path)
        .map_err(|why| format!("couldn't open {}: {}", path, why))?;

    let mut config = String::new();
    if file.read_to_string(&mut config).is_err() || config.is_empty() {
        // 如果文件是新创建的，或者文件是空的，我们将写入一个默认的配置信息
        config = r#"{
            "mode": "knockout",
            "round": 3,
            "pick": "5,3,1",
            "speed": 100,
            "keepOrder": true,
            "playSound": true
        }"#.to_string();
        file.write_all(config.as_bytes())
            .map_err(|why| format!("couldn't write to {}: {}", path, why))?;
    }

    Ok(config)
}

#[tauri::command]
fn save_config(config: String) -> Result<(), String> {
    let path = Path::new("config.json");
    let display = path.display();

    let mut file = match File::create(&path) {
        Err(why) => return Err(format!("couldn't create {}: {}", display, why)),
        Ok(file) => file,
    };

    match file.write_all(config.as_bytes()) {
        Err(why) => return Err(format!("couldn't write to {}: {}", display, why)),
        Ok(_) => Ok(()),
    }
}