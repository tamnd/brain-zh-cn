---
title: "CF 102419L - 作弊检测。"
description: "我们有两个用小型语言编写的程序，其中包含三种语句：定义变量、读取变量、打印变量以及将两个变量的和分配给另一个变量。"
date: "2026-08-12T20:38:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "L"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 769
verified: true
draft: false
---

[CF 102419L - 作弊检测。](https://codeforces.com/problemset/problem/102419/L)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个用小型语言编写的程序，其中包含三种语句：定义变量、读取变量、打印变量以及将两个变量的和分配给另一个变量。 一个变量最多定义一次，并且每个变量都在使用之前定义。 

如果我们可以重命名第一个程序中的变量，使得每个语句都与第二个程序中的语句完全相同，则这两个程序被认为是等效的。 重命名是全局的，所以如果`a`被重命名为`x`，每次出现`a`必须成为`x`。 中变量的顺序`define`语句是程序的一部分，加法的两个操作数也是位置的。 表达式`a=b+c`不等于`a=c+b`仅仅因为加法在数学上是可交换的。 

输入包含第一个程序中的行数和这些行，然后是第二个程序中的行数和这些行。 每个程序最多有1000行。 它足够小，以至于线性扫描很容易足够快，但它也足够大，以至于尝试变量之间的每一种可能的对应关系是完全不切实际的。 最多有 1000 个不同的变量，可以有多达`1000!`可能的重命名。 

第一个边缘情况是不同的节目长度。 例如，```
1
define a
2
define x
define y
```必须产生`NO`。 变量重命名无法插入或删除语句，因此具有不同行数的程序永远无法匹配。 仅比较相应位置中使用的变量的粗心实现可能会立即忽略这一点。 

第二个边缘情况是操作数的顺序。 考虑```
5
define a
define b
define c
a=b+c
print a
5
define x
define y
define z
x=z+y
print x
```正确的输出是`NO`。 这三个定义唯一可能的映射是`a -> x`,`b -> y`， 和`c -> z`。 在该映射下，`a=b+c`变成`x=y+z`， 不是`x=z+y`。 治疗`+`因为数学上交换会错误地接受这一对。 

第三种边缘情况是变量映射必须是一对一的。 例如，```
3
define a
define b
print a
3
define x
define x2
print x
```是`NO`。 第一个程序需要`a -> x`， 尽管`b`必须映射到不同的变量。 如果实现仅存储从第一个程序名称到第二个程序名称的映射并且从不检查相反方向，则它可能会意外地允许两个不同的变量映射到相同的名称。 

最后一个有用的情况是定义顺序不同时。 例如，```
5
define a
define b
define c
a=b+c
print a
5
define x
define z
define y
x=y+z
print x
```是`YES`， 使用`a -> x`,`b -> y`， 和`c -> z`。 文本名称本身没有任何意义。 重要的是一致的重命名是否使完整的语句序列相同。 

## 方法

 最直接的暴力方法是收集第一个程序中的所有变量和第二个程序中的所有变量，然后尝试这两个集合之间的每个双射。 对于每个候选双射，我们替换第一个程序中的每个变量并将结果程序与第二个程序进行比较。 这是正确的，因为作弊的定义正是这种双射的存在。 

问题是双射的数量。 如果有`k`不同的变量，有`k!`可能的映射。 测试一个映射需要`O(n+m)`工作，所以总复杂度是`O(k! (n+m))`。 和`k=1000`，即使候选者的数量多得难以想象，早在线路比较变得相关之前。 

关键的观察是程序本身告诉我们哪些变量必须对应。 我们不需要首先猜测完整的映射。 每当第一个程序在某个语句位置提到变量时，第二个程序中的相应位置就会告诉我们它必须映射到哪个变量。 一旦建立了对应关系，同一变量的每次出现都必须使用完全相同的目标。 

我们可以直接使用两个字典来强制执行此操作。 一个字典将第一个程序中的变量映射到第二个程序中的变量。 反向字典将第二个程序中的变量映射回第一个程序中的变量。 当比较一对变量出现时，要么之前没有见过映射并且我们建立它，要么它已经建立并且必须与当前对一致。 反向映射可防止两个不同的源变量分配给同一目标变量。 

蛮力方法之所以有效，是因为它显式搜索所有可能的重命名，但会失败，因为它们的阶乘数量很多。 观察到每个相应的事件立即限制唯一可能的映射，让我们在扫描程序一次时构建所需的双射。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(k! (n+m))`|`O(k+n+m)`| 太慢了|
 | 双向映射|`O(n+m)`|`O(k+n+m)`| 已接受 |

 ## 算法演练

 1. 阅读两个完整的程序，如果行数不同，则立即拒绝它们。 重命名可以更改名称，但不能更改程序结构。 
2. 将每一行解析为一个命令及其变量位置。 一个`define`,`read`， 或者`print`行包含一个变量。 赋值包含三个变量：目标、左操作数和右操作数。 命令本身永远不会被重命名。 
3. 创建两个空字典。 第一个存储从第一个程序中的变量到第二个程序中的变量的映射。 第二个存储反向映射。 
4. 从上到下扫描两个程序的对应行。 如果他们的命令不同，则返回`NO`，因为变量重命名不能更改命令，例如`read`进入`print`。 
5. 对于每对对应的变量位置，检查两个变量名称。 如果第一个变量已有映射，请验证它是否映射到当前的第二个变量。 如果没有，则返回`NO`。 
6. 如果第一个变量尚未映射，请检查第二个变量是否已从不同的第一个变量映射。 如果是，则返回`NO`。 否则建立映射的两个方向。 
7. 如果每个相应的位置都通过了这些检查，则返回`YES`。 此时，每个变量都有一个一致的对应项，并且由于每个命令和每个变量位置都匹配，因此重命名第一个程序会准确生成第二个程序。 

### 为什么它有效

 中心不变量是，在处理两个程序的任何前缀之后，两个字典描述了整个前缀的有效的一对一变量重命名。 当遇到一对新变量时，现有映射必须与其一致，而只有在其目标尚未分配给另一个源变量时才能引入新映射。 因此，每次变量出现后都会保留不变量。 

如果算法拒绝，则要么程序结构不同，要么某个变量需要两个不同的名称，或者两个不同的变量需要相同的名称。 这些情况都无法通过另一次全局重命名来修复，因此程序不能等效。 

如果算法到达最后，则任一程序使用的每个变量对应关系都是一致的并且是一对一的。 将每个第一个程序变量替换为其映射的第二个程序变量使得每个相应的语句都相同，这正是所需的条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def parse_line(line):
    line = line.strip()

    parts = line.replace(" ", "").split("=")

    if len(parts) == 1:
        command, var = line.split()
        return command, [var]

    left = parts[0]
    right = parts[1]
    b, c = right.split("+")
    return "assign", [left, b, c]

def equivalent(program1, program2):
    if len(program1) != len(program2):
        return False

    forward = {}
    backward = {}

    for line1, line2 in zip(program1, program2):
        command1, vars1 = parse_line(line1)
        command2, vars2 = parse_line(line2)

        if command1 != command2 or len(vars1) != len(vars2):
            return False

        for a, b in zip(vars1, vars2):
            if a in forward:
                if forward[a] != b:
                    return False
            else:
                if b in backward:
                    return False

                forward[a] = b
                backward[b] = a

    return True

def solve():
    n = int(input())
    program1 = [input().strip() for _ in range(n)]

    m = int(input())
    program2 = [input().strip() for _ in range(m)]

    print("YES" if equivalent(program1, program2) else "NO")

if __name__ == "__main__":
    solve()
```这`parse_line`函数通过在将其拆分为三个变量位置之前删除空格来标准化赋值语法。 这可以处理两种紧凑形式，例如`a=b+c`和间隔形式，例如`a = b + c`。 

对于一个简单的命令，`split()`将命令字与其变量分开。 解析器返回一个通用的内部表示，其中`assign`表示一个赋值以及包含目的地、左操作数和右操作数的关联列表（按完全相同的顺序）。 

这`equivalent`函数首先检查行数，因为两个程序必须具有相同的结构。 然后它维持`forward`和`backward`，实现了双射的两个方向。 

支票`forward[a] != b`捕获一个被迫有两个不同名称的变量。 这`backward`查找捕获两个不同的变量被迫共享一个目标名称。 这两项检查都是必要的，因为所需的重命名是两个程序中出现的变量之间的双射。 

没有递归，也没有数值计算，因此整数溢出和递归深度无关。 扫描处理每一行和每个变量出现一次，字典操作需要预期的恒定时间。 

## 工作示例

 ### 示例 1

 这两个程序具有相同的结构，因此算法开始比较它们的语句。 前三个定义建立了唯一可能的映射。 

| 线路| 命令 | 第一个可变位置 | 第二可变位置 | 映射状态 | 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 定义|`a`|`a`|`a -> a`| 继续 |
 | 2 | 定义|`b`|`b`|`a -> a`,`b -> b`| 继续 |
 | 3 | 定义|`c`|`c`|`a -> a`,`b -> b`,`c -> c`| 继续 |
 | 4 | 分配|`a,b,c`|`a,c,b`|`a -> a`同意，`b -> c`冲突 | 拒绝|

 4号线，目的地`a`是一致的，但是第一个程序需要`b -> c`并且现有的映射需要`b -> b`。 单个全局重命名无法满足这两个要求，因此答案是`NO`。 

### 示例 2

 这里的定义顺序不同，因此第一次出现就建立了一个重要的重命名。 

| 线路| 命令 | 第一个可变位置 | 第二可变位置 | 映射状态 | 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 定义|`a`|`a`|`a -> a`| 继续 |
 | 2 | 定义|`b`|`c`|`a -> a`,`b -> c`| 继续 |
 | 3 | 定义|`c`|`b`|`a -> a`,`b -> c`,`c -> b`| 继续 |
 | 4 | 分配|`a,b,c`|`a,c,b`| 所有映射都一致 | 继续 |
 | 5 | 打印 |`a`|`a`|`a -> a`同意| 接受|

 映射交换`b`和`c`。 将其应用于第一个程序转换`a=b+c`进入`a=c+b`，与第二个程序完全匹配。 该算法接受，因为以后的每次出现都遵循定义建立的映射。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n+m)`| 每个输入行和每个变量出现都被处理一次，并符合预期`O(1)`字典操作。 |
 | 空间|`O(n+m)`| 存储这两个程序，并且这两个映射需要与不同变量的数量成比例的空间。 |

 由于两个程序最多包含 1000 行，因此只需处理几千个变量出现。 线性解决方案远低于 1 秒和 256 MB 的限制。 阶乘暴力搜索是唯一根本上不合适的方法。 

## 测试用例```python
import sys
import io

def parse_line(line):
    line = line.strip()

    parts = line.replace(" ", "").split("=")

    if len(parts) == 1:
        command, var = line.split()
        return command, [var]

    left = parts[0]
    right = parts[1]
    b, c = right.split("+")
    return "assign", [left, b, c]

def equivalent(program1, program2):
    if len(program1) != len(program2):
        return False

    forward = {}
    backward = {}

    for line1, line2 in zip(program1, program2):
        command1, vars1 = parse_line(line1)
        command2, vars2 = parse_line(line2)

        if command1 != command2 or len(vars1) != len(vars2):
            return False

        for a, b in zip(vars1, vars2):
            if a in forward:
                if forward[a] != b:
                    return False
            else:
                if b in backward:
                    return False
                forward[a] = b
                backward[b] = a

    return True

def solve():
    n = int(input())
    program1 = [input().strip() for _ in range(n)]

    m = int(input())
    program2 = [input().strip() for _ in range(m)]

    return "YES" if equivalent(program1, program2) else "NO"

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        return solve()
    finally:
        sys.stdin = old_stdin
        input = old_input

sample1 = """\
5
define a
define b
define c
a=b+c
print a
5
define a
define b
define c
a=c+b
print a
"""
assert run(sample1) == "NO", "sample 1"

sample2 = """\
5
define a
define b
define c
a=b+c
print a
5
define a
define c
define b
a=c+b
print a
"""
assert run(sample2) == "YES", "sample 2"

sample3 = """\
5
define a
define b
define c
a=b+c
print a
5
define a
define b
define c
a=b+c
print a
"""
assert run(sample3) == "YES", "sample 3"

# Minimum-size programs. A single variable can always be renamed to another
# variable because there is no second constraint.
assert run("""\
1
define a
1
define x
""") == "YES", "minimum size"

# Different program lengths can never be made equal by renaming.
assert run("""\
1
define a
2
define x
define y
""") == "NO", "different lengths"

# The same source variable is forced to map to two different target variables.
assert run("""\
4
define a
define b
print a
print a
4
define x
define y
print x
print y
""") == "NO", "inconsistent mapping"

# The target variables are swapped, but the whole program is still equivalent.
assert run("""\
6
define first
define second
define third
first=second+third
print third
read first
6
define x
define z
define y
x=z+y
print y
read x
""") == "YES", "nontrivial bijection"

# Large input, exercising the linear scan.
lines1 = ["define v0"]
lines1.extend(f"define v{i}" for i in range(1, 1000))
lines1.append("print v999")

lines2 = ["define x0"]
lines2.extend(f"define x{i}" for i in range(1, 1000))
lines2.append("print x999")

large_input = (
    str(len(lines1)) + "\n" +
    "\n".join(lines1) + "\n" +
    str(len(lines2)) + "\n" +
    "\n".join(lines2) + "\n"
)
assert run(large_input) == "YES", "maximum-size linear scan"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一`define`每个程序中的行 |`YES`| 最小输入大小和基本重命名 |
 | 具有 1 行和 2 行的程序 |`NO`| 不同的节目长度|
 | 重复的源变量映射到不同的目标|`NO`| 正向映射的一致性|
 | 具有非平凡排列的三个变量 |`YES`| 双向重命名和重复使用|
 | 1000 个定义加上最终用途 |`YES`| 最大尺寸输入和线性复杂度 |

 ## 边缘情况

 在任何变量比较之前处理不同长度的情况。 为了```
1
define a
2
define x
define y
```

`equivalent`看到程序长度是`1`和`2`并立即返回`False`。 输出是`NO`。 没有映射可以改变语句的数量。 

对于操作数顺序的情况，```
4
define a
define b
define c
a=b+c
4
define x
define y
define z
x=z+y
```定义建立`a -> x`,`b -> y`， 和`c -> z`。 当完成赋值时，它的第一个变量对是`a -> x`，这是有效的。 第二对要求`b -> z`， 但`b`已经映射到`y`，因此算法拒绝。 输出是`NO`。 该算法从不对操作数进行排序，因此它正确地将表达式视为语法而不是数学加法。 

对于非平凡的排列，```
4
define a
define b
define c
a=b+c
4
define x
define z
define y
x=z+y
```前三行建立`a -> x`,`b -> z`， 和`c -> y`。 在作业中，三对是`a -> x`,`b -> z`， 和`c -> y`，所有这些都符合现有的映射。 输出是`YES`。 这说明了为什么比较原始变量名称或定义位置是不够的。 

对于不一致的重用，```
4
define a
define b
print a
print b
4
define x
define y
print x
print x
```第一个打印建立`a -> x`。 第二次打印要求`b -> x`。 反向字典已经包含`x -> a`，因此算法拒绝映射。 输出是`NO`。 如果没有反向字典，粗心的实现可能会接受将两个不同的变量重命名为同一变量，这不是有效的重命名。
