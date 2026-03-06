use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn burn(iterations: u32) -> u32 {
    let mut x: u32 = 0x12345678;

    for i in 0..iterations {
        x ^= i.wrapping_mul(0x9E3779B9);
        x = x.rotate_left(5).wrapping_add(0x7F4A7C15);
    }
    x
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! (from Rust/Wasm)", name)
}