---
title: "CF 87B - Vasya 和类型"
description: "此问题中的语言只有两种真正的基类型：void 和 errtype。 所有其他类型都是通过 typedef 定义的，每个查询都要求我们使用 typeof 计算类型表达式。 类型表达式是由基本名称加上一些 and & 运算符构建的。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 87
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 73 (Div. 1 Only)"
rating: 1800
weight: 87
solve_time_s: 116
verified: true
draft: false
---

[CF 87B - Vasya 和类型](https://codeforces.com/problemset/problem/87/B)

 **评分：** 1800
 **标签：** 实现、字符串
 **求解时间：** 1m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个问题中的语言只有两种真正的基本类型，`void`和`errtype`。 所有其他类型都是通过定义的`typedef`，每个查询都要求我们评估类型表达式`typeof`。 

类型表达式是由基本名称加上一些`*`和`&`运营商。 这些规则有意与 C 不同。 

追加`*`意思是“指向”的指针。 追加`&`意思是“取消引用”。 取消引用会将指针深度减少一。 如果我们尝试取消引用普通`void`，结果变为`errtype`。 

特殊类型`errtype`很吸引人。 一旦表达式变成`errtype`，添加`*`或者`&`保持它等于`errtype`。 

关键细节是操作员优先级。 取消引用的优先级低于指针创建的优先级。 这意味着：```
&T* = T
```不是```
(&T)*
```所以当我们解析类型表达式时，所有`*`运算符在概念上发生在所有之前`&`运营商。 

输入是按顺序处理的一系列操作。 一个`typedef A B`操作存储当前含义`A`进入名字`B`。 未来内部使用的名称的重新定义`A`不追溯影响`B`。 

一个`typeof A`查询要求我们评估`A`现在并打印其规范形式：```
void*****
```或者`errtype`。 

限制很小。 最多有100个操作，每个操作符字符串最多包含10个显式`*`和`&`符号。 即使 typedef 链变长，总工作量仍然很小。 任何针对每个查询进行线性或二次处理的解决方案都可以轻松适应。 

棘手的部分不是性能，而是忠实地对类型系统进行建模。 

一个常见的错误是从左到右评估运算符而不是尊重优先级。 

考虑：```
typedef void* p
typeof &p*
```粗心的实现可能会将其解释为：```
(&p)*
```变成：```
(&void*)* = void*
```但该语言定义：```
&p* = &(void**) = void*
```正确的结果是`void*`。 

另一个微妙的情况是 typedef 快照语义。 

考虑：```
typedef void* a
typedef a b
typedef void a
typeof b
```正确的输出是：```
void*
```因为`b`存储的含义`a`在定义时。 它没有引用`a`动态地。 

另一个危险的边缘情况是传播`errtype`。 

考虑：```
typedef &void bad
typeof bad*****
```解引用`void`立即产生`errtype`，一旦发生这种情况，每个后来的运算符仍然将其保留为`errtype`。 

正确的输出是：```
errtype
```保持负指针深度或尝试继续操作的简单实现`void`失败后会默默地产生错误的答案。 

## 方法

 暴力破解的想法是将每种类型按字面意思表示为字符串，例如：```
void****
```然后，对于每个查询，重复扩展 typedef 名称，直到达到具体类型。 之后，将所有运算符一一应用。 

这是可行的，因为语言语义很简单，而且约束也很小。 即使一个类型通过多个 typedef 层进行扩展，总共也只有 100 个操作。 

这种表示的问题在于它会鼓励错误的解析。 之间的优先规则`*`和`&`操作原始字符串时变得很尴尬。 很容易意外地按文本顺序而不是语义顺序处理运算符。 

重要的观察是，每个有效的非错误类型完全由一个整数决定：`void`。 

例如：```
void      -> depth 0
void*     -> depth 1
void***   -> depth 3
```取消引用会将深度减少一。 指针创建将深度增加一。 

如果深度变为负值，结果将变为`errtype`。 

这将整个问题转化为整数算术。 

解析表达式时：```
&&name***
```运算符优先级意味着：```
((name***)) with two dereferences afterward
```所以我们只需要：```
final_depth = base_depth + stars - amps
```如果基本类型已经是`errtype`，或者最终深度变为负数，结果为`errtype`。 

This representation also naturally handles typedef snapshot semantics. When defining a new type name, we simply store its evaluated integer depth at that moment.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²·L) | O(n·L) | O(n·L) | 已接受但容易出错 |
 | 最佳| O(n·L) | O(n·L) | O(n) | 已接受 |

 这里，`L`是最大表达长度。 

## 算法演练

 1. 创建一个字典，存储每个已知类型的含义。 

我们代表：```
void -> 0
errtype -> -1
```任何非负整数都表示`*`上面的符号`void`。 价值`-1`代表`errtype`。 
2. 对于每个操作，将行拆分为标记。 

操作是：```
typedef A B
```或者：```
typeof A
```3. 要计算类型表达式，请将其分为三个部分：

 领先的`&`符号,

 尾随的`*`符号,

 和核心类型名称。 

例如：```
&&ptr***
```变成：```
amps = 2
name = ptr
stars = 3
```4. 查找核心类型名称的当前含义。 

如果该名称不存在，则将其视为`errtype`。 
5. 如果基本类型已经是`errtype`， 返回`errtype`立即地。 

该语言定义：```
errtype* = errtype
&errtype = errtype
```6. 否则计算：```
depth = base_depth + stars - amps
```这完全符合所有的优先规则`*`运算符先于所有应用`&`运营商。 
7. 如果`depth < 0`， 返回`errtype`。 

负深度意味着我们试图取消引用普通`void`。 
8. 对于一个`typedef`，将评估的深度存储在新名称下。 

这存储了定义时类型的完整评估快照。 
9. 对于一个`typeof`， 打印：```
errtype
```如果结果是`-1`，否则打印：```
void + '*' * depth
```### 为什么它有效

 不变的是每个存储的类型名称总是映射到其完全评估的规范形式。 

非错误类型仅由其上面的指针深度表示`void`。 由于语言操作仅增加或减少指针深度，因此该表示捕获所有必要的信息。 

保留了运算符优先级，因为每个表达式的计算结果如下：```
base + all pointers - all dereferences
```这与取消引用的优先级低于指针创建的语言规则完全相同。 

由于 typedef 存储计算的深度而不是符号引用，因此以后的重新定义不会影响之前定义的类型。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def evaluate(expr, types):
    amps = 0
    i = 0

    while i < len(expr) and expr[i] == '&':
        amps += 1
        i += 1

    stars = 0
    j = len(expr) - 1

    while j >= i and expr[j] == '*':
        stars += 1
        j -= 1

    name = expr[i:j + 1]

    if name not in types:
        return -1

    base = types[name]

    if base == -1:
        return -1

    depth = base + stars - amps

    if depth < 0:
        return -1

    return depth

def solve():
    n = int(input())

    types = {
        "void": 0,
        "errtype": -1
    }

    out = []

    for _ in range(n):
        parts = input().split()

        if parts[0] == "typedef":
            expr = parts[1]
            new_name = parts[2]

            types[new_name] = evaluate(expr, types)

        else:
            expr = parts[1]

            result = evaluate(expr, types)

            if result == -1:
                out.append("errtype")
            else:
                out.append("void" + "*" * result)

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`evaluate`函数实现了整个类型系统。 

首先计算领先`&`符号和尾随`*`符号。 中间的所有内容都是实际的类型名称。 这种解析方法直接匹配语言语法并自动尊重运算符优先级。 

字典存储评估的深度而不是符号表达式。 这是保留 typedef 快照语义的实现细节。 如果稍后重新定义类型，则先前存储的条目将保持不变，因为它们已经包含其最终整数深度。 

特殊价值`-1`代表`errtype`。 使用单个哨兵值使所有传播规则变得简单。 一旦评价达到`-1`，每个未来的操作都会保留`-1`。 

最常见的实现错误是按文本顺序处理运算符。 该解决方案通过将表达式转换为：```
base + stars - amps
```另一个微妙之处是处理未定义的名称。 声明称他们立即成为`errtype`，因此评估器返回`-1`当字典中没有名字时。 

## 工作示例

 ### 示例 1

 输入：```
5
typedef void* ptv
typeof ptv
typedef &&ptv node
typeof node
typeof &ptv
```追踪：

 | 运营| 基本类型 | 明星| 安培| 结果深度 | 存储/输出|
 | --- | --- | --- | --- | --- | --- |
 | typedef void* ptv | 类型定义 0 | 1 | 0 | 1 | PTV = 1 |
 | ptv 类型 | 1 | 0 | 0 | 1 | 无效* |
 | typedef &&ptv 节点 | 1 | 0 | 2 | -1 | 节点=错误类型|
 | 节点类型 | 错误类型 | 0 | 0 | 错误类型 | 错误类型 |
 | 类型&ptv | 1 | 0 | 1 | 0 | 无效|

 第三个操作演示了取消引用次数过多。`ptv`等于`void*`， 所以`&&ptv`尝试取消引用两次并低于零深度。 

### 自定义示例

 输入：```
6
typedef void** a
typedef &a b
typedef b* c
typeof a
typeof b
typeof c
```追踪：

 | 运营| 基本类型 | 明星| 安培| 结果深度 | 存储/输出|
 | --- | --- | --- | --- | --- | --- |
 | typedef void** 一个 | 0 | 2 | 0 | 2 | a = 2 |
 | typedef &a b | 2 | 0 | 1 | 1 | b = 1 |
 | typedef b* c | 1 | 1 | 0 | 2 | c = 2 |
 | 类型 | 2 | 0 | 0 | 2 | 无效** |
 | 类型 b | 1 | 0 | 0 | 1 | 无效* |
 | c 的类型 | 2 | 0 | 0 | 2 | 无效** |

 此示例确认 typedef 存储评估值。`b`变成`void*`， 和`c`变成`void**`独立于以后的更改。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·L) | O(n·L) | 每个操作扫描其表达式一次 |
 | 空间| O(n) | 字典中每个 typedef | 最多存储一个条目

 这里，`L`是最大表达长度。 

由于最多 100 个操作和非常短的表达式，运行时间很短。 该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    def evaluate(expr, types):
        amps = 0
        i = 0

        while i < len(expr) and expr[i] == '&':
            amps += 1
            i += 1

        stars = 0
        j = len(expr) - 1

        while j >= i and expr[j] == '*':
            stars += 1
            j -= 1

        name = expr[i:j + 1]

        if name not in types:
            return -1

        base = types[name]

        if base == -1:
            return -1

        depth = base + stars - amps

        if depth < 0:
            return -1

        return depth

    n = int(input())

    types = {
        "void": 0,
        "errtype": -1
    }

    out = []

    for _ in range(n):
        parts = input().split()

        if parts[0] == "typedef":
            types[parts[2]] = evaluate(parts[1], types)
        else:
            result = evaluate(parts[1], types)

            if result == -1:
                out.append("errtype")
            else:
                out.append("void" + "*" * result)

    return "\n".join(out)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

# provided sample
assert run(
"""5
typedef void* ptv
typeof ptv
typedef &&ptv node
typeof node
typeof &ptv
"""
) == "void*\nerrtype\nvoid"

# minimum input
assert run(
"""1
typeof void
"""
) == "void"

# undefined type
assert run(
"""1
typeof abc
"""
) == "errtype"

# typedef snapshot semantics
assert run(
"""4
typedef void* a
typedef a b
typedef void a
typeof b
"""
) == "void*"

# errtype propagation
assert run(
"""3
typedef &void bad
typedef bad***** x
typeof x
"""
) == "errtype"

# precedence check
assert run(
"""2
typedef void* p
typeof &p*
"""
) == "void*"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`typeof void`|`void`| 最小有效查询 |
 |`typeof abc`|`errtype`| 未定义类型处理 |
 | 重新定义`a`定义后`b`|`void*`| Typedef 快照语义 |
 | 使用`bad*****`错误后 |`errtype`| 错误类型传播 |
 |`typeof &p*`|`void*`| 正确的运算符优先级 |

 ## 边缘情况

 考虑未定义的类型：```
1
typeof abc
```评估者摘录：```
name = abc
```自从`abc`字典中不存在，评估立即返回`-1`，打印为：```
errtype
```这与未知类型自动变为的陈述相匹配`errtype`。 

现在考虑过度解除引用：```
2
typedef void p
typeof &p
```

`p`有深度`0`。 该查询应用一种取消引用：```
0 - 1 = -1
```负深度无效，所以结果变成：```
errtype
```该算法通过以下方式干净地处理了这个问题：`depth < 0`查看。 

最后，考虑 typedef 重新定义：```
5
typedef void* a
typedef a b
typedef void a
typeof a
typeof b
```踪迹是：

 | 步骤| 一个 | 乙|
 | --- | --- | --- |
 | 在第一个 typedef 之后 | 1 | 未定义 |
 | 在第二个 typedef 之后 | 1 | 1 |
 | 重新定义 | 后 0 | 1 |

 输出变为：```
void
void*
```因为该算法将完全评估的深度存储在字典中。`b`即使之后仍保留旧值`a`变化。
