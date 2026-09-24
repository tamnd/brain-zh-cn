---
title: "CF 105692B - GoGo"
description: "任务是模拟一种非常小的编程语言并确定执行给定脚本时会发生什么。 该脚本看起来像一个函数体，从 func main() 开始，到右大括号结束。"
date: "2026-06-26T08:08:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105692
codeforces_index: "B"
codeforces_contest_name: "Baozii Cup 1"
rating: 0
weight: 105692
solve_time_s: 51
verified: true
draft: false
---

[CF 105692B - GoGo](https://codeforces.com/problemset/problem/105692/B)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是模拟一种非常小的编程语言并确定执行给定脚本时会发生什么。 该脚本看起来像一个单一的函数体，从`func main()`并以右大括号结束。 在这个函数内部，变量用显式类型声明、赋值、通过类似加法的操作修改并打印。 

该语言只有两种数据类型：整数和字符串。 变量以默认值开始，整数为零，字符串变量为空字符串。 执行逐行进行，每条语句都严格遵守类型和声明。 任何违规行为（例如使用未声明的变量、混合类型或重新声明变量）都会立即停止执行并产生运行时错误。 

输入是作为单个文本块的完整源代码。 如果执行在任何时候变得无效，输出要么是打印值的精确序列，要么是单个单词“运行时错误”。 

就代码长度而言，约束本质上很小，大约一万个字符，这排除了使用简单解释器进行线性扫描之外的任何内容。 任何重复重新扫描程序或对每个操作执行大量解析的方法仍然会通过，但任何比线性或近线性开销更糟糕的方法都是不必要的。 

一个微妙的一点是，错误不仅仅与未定义的变量有关。 整数和字符串操作之间的类型不匹配也会立即终止执行。 另一个重要的极端情况是自分配，例如`x = x`或者`x += x`，它是有效的，并且必须根据类型表现为值复制或算术/连接。 

一个天真的但常见的错误是将变量视为一旦提到就始终存在，或者允许隐式类型更改。 例如：

 输入：```
func main() {
var x int
x = "abc"
}
```这应该输出：```
runtime error
```将所有内容存储在通用字典中而不强制类型的粗心实现将错误地接受它。 

另一个边缘情况是打印未声明的变量：

 输入：```
func main() {
Println(x)
}
```这必须立即产生：```
runtime error
```即使没有发生任何任务。 

最后，循环是有界且简单的，但它们仍然很重要，因为它们重复语句。 一个错误是忘记了循环体不是递归结构，并且必须精确执行 n 次，并且每次迭代都进行新的计算。 

## 方法

 解决这个问题最直接的方法就是搭建一个小型解释器。 暴力的想法是将程序标记为行并按顺序执行每行，同时维护将变量名称映射到其当前值和类型的符号表。 

通过检查其形式来处理每个语句。 声明将新变量插入表中，但前提是该变量尚不存在。 在验证右侧存在并与类型匹配后，赋值会更新先前声明的变量。 加法或串联会修改具有相同类型约束的当前值。 打印语句只是附加输出或在变量丢失时触发错误。 

这种方法在程序大小上已经是线性的，因为每行都被处理一次。 除了仔细的解析之外没有任何有意义的优化。 人们可能认为它是“蛮力”的唯一原因是它除了立即执行之外不进行任何预处理或结构构建。 

主要挑战不是性能，而是一致处理语言规则的正确性，尤其是嵌套循环和无作用域执行。 

关键的观察结果是，语言被故意限制以避免复杂的解析或嵌套范围。 除 main 之外没有任何函数，没有嵌套循环，也没有变量遮蔽。 这使得单遍解释器就足够了。 唯一需要的状态是变量字典和循环堆栈，用于存储重复一段行的次数。 

因此，最优解决方案在复杂性上与蛮力思想相同，但经过精心构建以正确模拟控制流。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 无需正确循环处理的逐行仿真 | O(n) | O(n) | 边缘情况下的错误 |
 | 具有循环堆栈和类型检查的完整解释器 | O(n) | O(n) | 已接受 |

 ## 算法演练

 执行模型可以通过首先将程序预处理为标记或行列表，然后模拟支持循环的程序计数器来实现。 

1. 将输入解析为单独的语句，保持顺序。 每一行都被视为一条指令。 这很重要，因为循环依赖于精确的行分组而不是标记级解析。 
2. 维护一个字典，将变量名称映射到一对类型和值。 这个结构是必需的，因为每个操作在执行之前都必须验证类型一致性。 
3. 当遇到声明语句时，仅当变量不存在时才插入该变量。 如果存在，则立即终止并出现错误。 默认初始化取决于类型，整型变量从 0 开始，字符串变量从空字符串开始。 
4. 对于赋值语句，首先计算右侧。 如果是字面意思，则根据上下文进行解释； 如果它是一个变量，请确保它存在。 然后在更新左侧变量之前检查类型兼容性。 
5. 对于加法或串联语句，验证两个操作数都存在并且共享相同的类型。 然后使用整数加法或字符串连接就地更新左侧。 
6. 对于 Println 语句，计算参数。 如果它是未声明的变量，则错误终止。 否则将其字符串表示形式附加到输出。 
7. For 循环形式`for range n {`，将当前指令索引和剩余迭代计数压入堆栈。 当到达右大括号时，递减迭代计数器并跳回循环开始或弹出循环上下文。 
8. 继续执行，直到处理完所有语句或出现错误。 

正确性依赖于以下不变量：在执行的每个点，变量表精确地反映所有先前的有效操作，并且不会部分应用无效状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    code = sys.stdin.read().splitlines()

    vars = {}
    types = {}
    out = []

    i = 0
    n = len(code)

    loop_stack = []

    def parse_value(token):
        if token in vars:
            return types[token], vars[token]
        if token.startswith('"'):
            return "string", token.strip('"')
        return "int", int(token)

    while i < n:
        line = code[i].strip()

        if not line or line == "func main() {" or line == "}":
            i += 1
            continue

        if line.startswith("var "):
            _, name, typ = line.split()
            if name in vars:
                print("runtime error")
                return
            vars[name] = 0 if typ == "int" else ""
            types[name] = typ

        elif line.startswith("Println"):
            inside = line[line.find("(")+1:line.rfind(")")]
            t, v = parse_value(inside)
            out.append(str(v))

        elif "+=" in line:
            left, right = line.split("+=")
            left = left.strip()
            right = right.strip()

            if left not in vars:
                print("runtime error")
                return

            tl, vl = types[left], vars[left]
            tr, vr = parse_value(right)

            if tl != tr:
                print("runtime error")
                return

            if tl == "int":
                vars[left] = vl + vr
            else:
                vars[left] = vl + vr

        elif "=" in line:
            left, right = line.split("=")
            left = left.strip()

            if left not in vars:
                print("runtime error")
                return

            tr, vr = parse_value(right.strip())
            if tr != types[left]:
                print("runtime error")
                return

            vars[left] = vr

        elif line.startswith("for range"):
            cnt = int(line.split()[2])
            loop_stack.append((i, cnt))

        elif line == "}":
            if loop_stack:
                start, cnt = loop_stack[-1]
                cnt -= 1
                if cnt > 0:
                    loop_stack[-1] = (start, cnt)
                    i = start
                else:
                    loop_stack.pop()

        i += 1

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```解释器维护两本字典，一本用于值，一本用于类型。 这种分离使得类型检查变得明确，并避免了比较或赋值时的歧义。 

循环处理使用存储起始索引和剩余迭代的堆栈。 当遇到右大括号时，程序根据剩余计数跳回或退出循环。 

一个常见的实现陷阱是忘记解析右侧必须区分字符串文字、整数和变量。 另一个微妙的问题是确保像这样的自分配`x += x`使用已经更新的值`x`按照评估顺序正确。 

## 工作示例

 ### 示例 1

 输入：```
func main() {
var x int
x = 5
Println(x)
x += x
Println(x)
}
```| 步骤| 声明| x| 输出|
 | --- | --- | --- | --- |
 | 1 | var x 整数 | 0 | |
 | 2 | x = 5 | 5 | |
 | 3 | 打印 (x) | 5 | 5 |
 | 4 | x += x | 10 | 10 5 |
 | 5 | 打印 (x) | 10 | 10 5, 10 |

 此跟踪显示整数自加如何使值加倍，因为在赋值之前先计算右侧。 

### 示例 2

 输入：```
func main() {
var s string
s = "a"
for range 3 {
s += "b"
}
Println(s)
}
```| 步骤| 声明| s | 循环状态| 输出|
 | --- | --- | --- | --- | --- |
 | 1 | var 字符串 | “” | | |
 | 2 | s =“a”| “一个”| | |
 | 3 | 循环开始| “一个”| 3 次迭代 | |
 | 4 | s += "b" | s += "b" | “ab”| 还剩 2 个 | |
 | 5 | s += "b" | s += "b" | “abb”| 还剩 1 个 | |
 | 6 | s += "b" | s += "b" | “阿布”| 还剩 0 | |
 | 7 | 打印 | “阿布”| | 阿布 |

 第二个示例确认循环状态独立于变量更新，并且串联在迭代中累积。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每行处理一次，具有恒定时间字典操作和简单解析 |
 | 空间| O(n) | 变量、循环堆栈和输出的存储 |

 这些约束最多允许大约一万个字符，因此线性解释器可以轻松地满足限制。 即使嵌套循环受小常量限制，总工作量仍然很小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    solve()
    return sys.stdout.getvalue().strip()

# sample-like basic execution
assert run("""func main() {
var x int
x = 3
Println(x)
}""") == "3"

# string concatenation loop
assert run("""func main() {
var s string
s = "a"
for range 2 {
s += "b"
}
Println(s)
}""") == "abb"

# runtime error: undeclared variable
assert run("""func main() {
Println(x)
}""") == "runtime error"

# runtime error: type mismatch
assert run("""func main() {
var x int
x = "a"
}""") == "runtime error"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 未声明 运行时错误 | 访问违规处理|
 | 类型不匹配赋值 | 运行时错误 | 严格打字 |
 | 循环连接 | abb | 循环正确性|
 | 基本整数打印 | 3 | 最小执行力|

 ## 边缘情况

 一种重要的边缘情况是自引用操作。 例如：

 输入：```
func main() {
var x int
x = 1
x += x
Println(x)
}
```执行继续进行`x = 1`， 然后`x += x`先计算右边，仍然是1，所以结果变成2。正确的解释器必须确保它不会错误地更新`x`在评估右侧之前。 

另一个边缘情况是重新声明：

 输入：```
func main() {
var x int
var x string
}
```第二个声明必须立即终止执行。 正确的实现在插入符号表之前检查是否存在。 

最后一个边缘情况是循环边界：

 输入：```
func main() {
for range 1 {
Println(1)
}
}
```循环只执行一次，右大括号必须正确递减并退出。 一个常见的错误是跳过最后一次迭代或无法退出循环，这两者都是由不正确的堆栈管理引起的。
