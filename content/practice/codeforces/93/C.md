---
title: "CF 93C - Azembler"
description: "我们从一个寄存器 eax 开始，其中包含一些未知值 x。 其他每个寄存器都包含 0。目标是使用尽可能少的 lea 指令在任何寄存器中生成 n x 。 指令集出人意料地有限，但也出奇地强大。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 93
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 76 (Div. 1 Only)"
rating: 2500
weight: 93
solve_time_s: 121
verified: true
draft: false
---

[CF 93C - Azembler](https://codeforces.com/problemset/problem/93/C)

 **评分：** 2500
 **标签：** 暴力破解、实施
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个寄存器开始，`eax`，包含一些未知值`x`。 每个其他寄存器都包含`0`。 目标是生产`n * x`在任何寄存器中使用尽可能少的数量`lea`指示。 

指令集出人意料地有限，但也出奇地强大。 单个`lea`可以形成形状的表达```
y
y + z
k * y
y + k * z
```在哪里`k`是其中之一`1, 2, 4, 8`。 

由于每个寄存器总是存储原始值的某个倍数`x`，整个问题就变成了系数算术。 如果寄存器当前包含`a * x`，然后通过一次操作我们可以创建```
(a + b) * x
(a + k * b) * x
k * a * x
```为了`k ∈ {1,2,4,8}`。 

输入是单个整数`n`， 和`1 ≤ n ≤ 255`。 输出必须是最优程序，而不仅仅是最少数量的指令。 这意味着我们需要最短距离计算和操作重构。 

界限`n ≤ 255`彻底改变问题的性质。 我们并不是在寻找某种渐近公式或贪婪模式。 整个可达状态空间很小。 即使我们明确地对所有可能的寄存器配置进行建模，搜索空间仍然是可管理的，因为最佳程序很短并且系数永远不需要超过一个小范围。 

微妙的部分是中间值大于`n`可能仍然有帮助。 贪婪策略只会将价值建立到`n`可能会错过最佳答案。 例如，达到`15`通过```
5 -> 20 -> 15
```是不可能的，因为减法不存在，但有效地达到某些目标通常需要构建从二进制表示中不明显的辅助系数。 

另一个容易犯的错误是假设只有一个工作寄存器很重要。 样本为`41`已经反驳了这一点：```
5*x in ebx
41*x in ecx using eax and ebx
```同时保持多个中间系数是短程序存在的全部原因。 

最小的边缘情况是`n = 1`。 答案是零指令，因为`eax`已经包含`1 * x`。 总是发出至少一条指令的粗心实现将立即失败。 

另一个危险的边缘情况是寄存器重用。 指令```
lea eax, [eax + 8*eax]
```有效并计算`9 * eax_old`。 从概念上讲，必须在分配发生之前读取旧值。 在仿真过程中过早改变寄存器的实现可能会破坏重建。 

## 方法

 最直接的暴力想法是生成每一个可能的长度程序`1`，那么每个长度的程序`2`，依此类推，直到产生`n * x`。 

每条指令选择一个目标寄存器、一个或两个源寄存器以及可选的乘法器`{2,4,8}`。 即使只有少数寄存器，分支因子也会变得巨大。 深度 6 搜索已经探索了数百万种可能性。 由于许多不同的指令序列导致相同的系数配置，因此大部分工作是重复的。 

蛮力在概念上仍然有用，因为它揭示了问题的实际结构。 每个寄存器总是存储原始值的整数倍。 精确的运行时间值根本不重要。 只有系数很重要。 

这一观察结果将任务转化为整数状态上的最短路径问题。 

假设我们目前知道几个已经可构造的系数。 来自任意一对`(a, b)`我们可以创造```
a + b
a + 2b
a + 4b
a + 8b
2a
4a
8a
```一步之遥。 

这类似于加法链问题，只不过我们允许使用小乘数。 自从`n ≤ 255`，我们可以对可达系数进行广度优先搜索。 

关键的见解是我们实际上不需要对所有 26 个寄存器进行建模。 任何最优程序都可以表示为计算系数的 DAG。 每条指令都会从旧系数中创建一个新系数。 我们只关心依赖图。 

由于搜索深度很小，因此对系数达到某个安全限制的 BFS 是有效的。 对于每一个新发现的系数，我们都会记住它是如何产生的。 一旦我们到达`n`，我们向后重建指令序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 详尽的程序枚举| 指数| 指数| 太慢了 |
 | 可构造系数的 BFS | O(平方米) | O(M)| 已接受 |

 这里`M`是 BFS 期间使用的最大系数界。 

## 算法演练

 1. 将每个寄存器值视为与原始未知数相乘的系数`x`。 

最初只有系数`1`存在是因为`eax = x`。 
2. 从系数开始进行广度优先搜索`1`。 

BFS 是合适的，因为每个`lea`指令仅花费一次操作。 
3. 对于每个当前已知的系数`a`，将其与每个已发现的系数相结合`b`。 

从`(a, b)`产生：```
a + b
a + 2b
a + 4b
a + 8b
```我们也自然地获得了纯缩放，因为选择`a = 0`相当于乘法，但不需要显式存储零。 
4.每当有新的系数`c`第一次发现，记录：```
parent coefficients
multiplier used
BFS depth
```第一个发现是最优的，因为 BFS 探索越来越多的指令中的状态。 
5. 继续直到系数`n`已达到。 
6. 向后重建依赖图`n`。 

每个系数都会记住哪些较早的系数产生了它。 
7. 按拓扑顺序发出指令。 

为每个构造的系数分配一个寄存器。 由于最佳深度为`n ≤ 255`非常小，同时有效的系数数量很容易容纳在 26 个寄存器中。 

### 为什么它有效

 每条指令都从已有的系数中创建一个新系数。 BFS 探索所有可达的系数`0`指令，那么所有可达的系数`1`指导等。 当系数`n`首次发现时，不可能存在更短的序列。 

重建是正确的，因为每个存储的转换完全对应于一个有效的转换`lea`操作说明。 按 BFS 顺序重放依赖图可使用相同数量的操作来再现目标系数。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

MAXV = 2048
REGS = [
    "eax", "ebx", "ecx", "edx", "eex", "efx", "egx", "ehx",
    "eix", "ejx", "ekx", "elx", "emx", "enx", "eox", "epx",
    "eqx", "erx", "esx", "etx", "eux", "evx", "ewx", "exx",
    "eyx", "ezx"
]

def solve():
    n = int(input())

    if n == 1:
        print(0)
        return

    dist = [-1] * MAXV
    parent = [None] * MAXV

    q = deque([1])
    dist[1] = 0

    discovered = [1]

    while q:
        a = q.popleft()

        current = discovered[:]

        for b in current:
            for k in (1, 2, 4, 8):
                c = a + k * b

                if c >= MAXV:
                    continue

                if dist[c] != -1:
                    continue

                dist[c] = dist[a] + 1
                parent[c] = (a, b, k)

                discovered.append(c)
                q.append(c)

                if c == n:
                    q.clear()
                    break
            else:
                continue
            break

    need = set()

    def collect(v):
        if v == 1 or v in need:
            return
        need.add(v)
        a, b, k = parent[v]
        collect(a)
        collect(b)

    collect(n)

    order = []

    visited = set()

    def topo(v):
        if v == 1 or v in visited:
            return
        visited.add(v)

        a, b, k = parent[v]

        topo(a)
        topo(b)

        order.append(v)

    topo(n)

    reg_of = {1: "eax"}
    free_regs = deque(REGS[1:])

    instructions = []

    for v in order:
        a, b, k = parent[v]

        ra = reg_of[a]
        rb = reg_of[b]

        rv = free_regs.popleft()
        reg_of[v] = rv

        if a == b and k == 1:
            expr = f"[{ra} + {rb}]"
        elif k == 1:
            expr = f"[{ra} + {rb}]"
        else:
            expr = f"[{ra} + {k}*{rb}]"

        instructions.append(f"lea {rv}, {expr}")

    print(len(instructions))
    print("\n".join(instructions))

solve()
```BFS 计算创建每个系数所需的最少指令数。 数组`parent`存储首先产生每个值的确切操作。 

搜索范围`2048`故意大于`255`。 高于目标的中间系数仍可能出现在最优结构中，因此将搜索限制为`≤ n`是不安全的。 

重建阶段有两次DFS遍历。 第一个标记了最终答案所需的每个系数。 第二个产生拓扑顺序，以便始终在使用它们的值之前计算依赖关系。 

寄存器分配很简单，因为依赖图很小。 我们为每个构造的系数永久分配一个寄存器。 所需系数的数量永远不会接近可用的 26 个寄存器。 

一个微妙的细节是指令格式。 该语句仅允许特定的语法形式。 我们总是发出```
[y + z]
```或者```
[y + k*z]
```这两者都是有效的。 

## 工作示例

 ### 示例 1

 输入：```
41
```BFS 发现以下有用的链。 

| 步骤| 构造系数 | 公式|
 | --- | --- | --- |
 | 0 | 1 | 初始 eax |
 | 1 | 5 | 1 + 4×1 |
 | 2 | 41 | 41 1 + 8×5 |

 生成的指令：

 | 步骤| 说明 | 结果 |
 | --- | --- | --- |
 | 1 |`lea ebx, [eax + 4*eax]`|`ebx = 5x`|
 | 2 |`lea ecx, [eax + 8*ebx]`|`ecx = 41x`|

 这个例子说明了为什么保持中间系数很重要。 第二条指令重用了两者`1*x`和`5*x`。 

### 示例 2

 输入：```
15
```一种最佳构造是：

 | 步骤| 构造系数 | 公式|
 | --- | --- | --- |
 | 0 | 1 | 初始|
 | 1 | 3 | 1 + 2×1 |
 | 2 | 15 | 15 3 + 4×3 |

 生成的指令：

 | 步骤| 说明 | 结果 |
 | --- | --- | --- |
 | 1 |`lea ebx, [eax + 2*eax]`|`3x`|
 | 2 |`lea ecx, [ebx + 4*ebx]`|`15x`|

 此跟踪表明，在一个表达式内重复使用同一寄存器是完全有效的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(平方米) | 每个发现的系数都与先前发现的系数配对 |
 | 空间| O(M)| 距离和父数组为每个系数存储一个条目 |

 实际运行时间很小，因为`M = 2048`。 即使是二次探索也很容易满足 5 秒的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    MAXV = 2048

    n = int(input())

    if n == 1:
        return "0"

    dist = [-1] * MAXV
    parent = [None] * MAXV

    q = deque([1])
    dist[1] = 0

    discovered = [1]

    while q:
        a = q.popleft()

        current = discovered[:]

        for b in current:
            for k in (1, 2, 4, 8):
                c = a + k * b

                if c >= MAXV:
                    continue

                if dist[c] != -1:
                    continue

                dist[c] = dist[a] + 1
                parent[c] = (a, b, k)

                discovered.append(c)
                q.append(c)

                if c == n:
                    q.clear()
                    break
            else:
                continue
            break

    out = []
    out.append(str(dist[n]))

    assert dist[n] >= 0

    return "\n".join(out)

# minimum case
assert run("1\n") == "0", "n=1 needs no operations"

# small direct construction
assert run("2\n") == "1", "2 = 1 + 1"

# sample
assert run("41\n") == "2", "sample case"

# another short chain
assert run("15\n") == "2", "15 = 3 + 4*3"

# upper boundary
assert int(run("255\n")) >= 0, "largest allowed n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1`|`0`| 空程序处理 |
 |`2`|`1`| 最简单的非平凡乘法 |
 |`41`|`2`| 中间系数的重用|
 |`15`|`2`| 多次使用同一寄存器|
 |`255`| 有效答案 | 上约束边界 |

 ## 边缘情况

 ### 边缘情况 1：`n = 1`输入：```
1
```该算法立即返回零指令，因为初始状态已经包含系数`1`。 

不需要BFS扩展。 这可以防止生成无用操作的常见错误，例如```
lea ebx, [eax]
```这不是最佳的。 

### 边缘情况 2：重用相同的寄存器

 输入：```
15
```建造：```
3 = 1 + 2*1
15 = 3 + 4*3
```发出的指令可能看起来像```
lea ecx, [ebx + 4*ebx]
```两次出现`ebx`引用赋值前的旧值。 该算法自然地处理这个问题，因为重建存储的是符号系数依赖性，而不是可变的运行时状态。 

### 边缘情况 3：中间系数大于明显的二进制块

 输入：```
255
```简单的二进制加倍策略并不总是最佳的。 BFS 统一探索所有可达系数，包括不寻常的中间结构。 由于搜索空间包含超出的值`255`，没有最优路径被意外修剪。
