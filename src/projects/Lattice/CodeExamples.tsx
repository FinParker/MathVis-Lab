import React from 'react';

const Box = ({ children, title, className = '' }: { children: React.ReactNode; title: string; className?: string }) => (
  <div className={`border rounded-lg p-4 bg-white shadow-sm ${className}`}>
    <h3 className="font-semibold mb-2 text-slate-800 border-b pb-1">{title}</h3>
    <div className="text-sm font-mono whitespace-pre overflow-x-auto">
      {children}
    </div>
  </div>
);

export const CodeExamples = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
      <Box title="TypeScript: Union & Intersection" className="border-blue-200 bg-blue-50">
        {`// Join (Union): |
// 寻找最小上界 (LUB)
type Pet = Cat | Dog; 

// Meet (Intersection): &
// 寻找最大下界 (GLB)
type SuperHero = Person & Flyable;

// Top Type
let a: unknown = "string"; // OK
let b: unknown = 123;      // OK

// Bottom Type
function error(message: string): never {
  throw new Error(message);
}

// 格的运算
type T1 = string | number; // Union
type T2 = string & number; // never (Intersection of disjoint types)`}
      </Box>

      <Box title="Rust: Traits & Never Type" className="border-orange-200 bg-orange-50">
        {`// Trait 类似于接口，定义行为
trait Animal {}
trait Friendly {}

struct Dog;
impl Animal for Dog {}
impl Friendly for Dog {}

// 使用 dyn keyword 表示动态分发 (Top-like upcasting)
fn pet(a: &dyn Friendly) {}

// Bottom Type: !
// 永远不会返回的函数
fn infinite_loop() -> ! {
    loop {}
}

// ! 可以被强制转为任何类型
let x: i32 = match condition {
    true => 100,
    false => panic!("oops"), // returns !
};`}
      </Box>

      <Box title="Java: Class Hierarchy (Interfaces)" className="border-red-200 bg-red-50">
        {`interface Animal {}
interface Hunter {}

// 单继承，多实现
class Lion implements Animal, Hunter {} 
class Tiger implements Animal, Hunter {}

// 最小上界 (LUB)
// Java 编译器会推断出 Animal & Hunter
Animal beast = coinFlip ? new Lion() : new Tiger();

// Object 是所有的 Top
Object o = new Lion();

// Java 没有真正的 Bottom 类型
// 但 null 某种程度上扮演了这个角色
String s = null;
Integer i = null;`}
      </Box>

      <Box title="Lattice Logic Breakdown" className="border-gray-200 bg-gray-50">
        {`Lattice L = <S, ≤>

Join (∨): a ∨ b = sup{a, b}
Meet (∧): a ∧ b = inf{a, b}

Example: Set of types T
≤ is Subtyping relation (<:)

For Types A, B:
A ∨ B => Union Type (A | B) or Common Superclass
A ∧ B => Intersection Type (A & B) or "Nothing"

Top (⊤) => Any / Object / unknown
Bottom (⊥) => Nothing / ! / never`}
      </Box>
    </div>
  );
};
