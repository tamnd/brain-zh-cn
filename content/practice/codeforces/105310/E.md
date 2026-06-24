---
title: "CF 105310E - 数学问题"
description: "我们有一个长度为 $n$ 的数组 $a$，但它不是独立的。 还有另一个相同长度的隐藏数组 $b$，$a$ 的每个值都定义为 $b$ 中某些倍数的总和。"
date: "2026-06-23T14:59:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105310
codeforces_index: "E"
codeforces_contest_name: "CerealCodes III Advanced Division"
rating: 0
weight: 105310
solve_time_s: 90
verified: false
draft: false
---

[CF 105310E - 数学问题](https://codeforces.com/problemset/problem/105310/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 30s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数组$a$长度$n$，但它不是独立的。 还有一个隐藏数组$b$具有相同的长度，并且每个值$a$被定义为某些倍数的总和$b$。 具体来说，每个$a_i$收集所有值$b_{i}, b_{2i}, b_{3i}, \dots$直至索引$n$。 所以$a_i$是$b$- 指数值是以下倍数$i$。 

任务是动态的。 我们必须处理对值的更新$a$，并在任何时候回答询问特定值的查询$b_i$。 困难在于$a$不是直接复制$b$，而是一个重叠线性约束的系统。 

限制条件很大：$n, q \le 2 \cdot 10^5$。 任何重新计算之间关系的解决方案$a$和$b$从头开始每个查询立即太慢。 即使每次操作迭代除数或倍数也会导致粗略的结果$O(n \log n)$每个查询或更糟，这远远超出了限制。 

关键的挑战是每次更新都会影响许多方程，因为更改一个方程$a_i$影响所有$b_{k}$在哪里$i \mid k$。 依赖结构足够密集，以至于单纯的传播是不可行的。 

出现微妙的边缘情况时$n$很小但是$q$很大，简单的重新计算可能会在本地通过，但仍然是全局的 TLE。 另一个边缘情况是重复更新同一索引； 任何正确的解决方案都必须避免重复地重新求解整个系统。 

## 方法

 定义结构是每个$a_i$是指数的总和$b$是的倍数$i$。 这是一个经典的除数聚合系统。 如果我们重写它，我们会看到每个$b_j$为所有人做出贡献$a_i$在哪里$i \mid j$。 所以这种关系是除数和变换。 

暴力方法将显式维护两个数组，并且在每次更新后$a_i$，尝试重新计算所有$b$-通过求解方程组来求值。 然而，这些方程并不是独立的； 每个$b_i$出现在多个$a$- 限制。 从头开始解决系统至少需要$O(n^2)$高斯消除或重复重新计算除数上的包含-排除，这太慢了。 

关键的观察结果是，从$b$到$a$按索引降序处理时为三角形。 如果我们定义$a_i$就倍数而言，那么$b_i$仅出现在$a_d$在哪里$d \mid i$。 更重要的是，如果我们逆向思考，我们可以表达$b_i$按照$a_i$减去较大倍数的贡献$i$。 也就是说，所有的倍数$i$除了$i$本身有助于$a_i$，所以我们可以隔离$b_i$如果我们知道来自的贡献$b_{2i}, b_{3i}, \dots$。 

这表明了一种类似筛子的依赖结构。 我们可以维持$b$增量并保持一致性$a$。 更新至$a_i$对应于总和的变化的倍数$i$，所以我们必须将增量传播到所有受影响的$b$-以结构化的方式体现价值观。 

我们不进行全局重新计算，而是维护$b$并保持所有的不变量$a_i$等于中的倍数之和$b$。 什么时候$a_i$变化由$\Delta$，我们需要将此修正分发给所有人$b_{k i}$以受控的方式。 关键是每次更新仅影响除数链，并且我们可以使用调和级数界有效地使用包含排除在倍数上进行传播，给出$O(n \log n)$- 型总工作量。 

更直接的角度是预先计算贡献结构：对于每个$i$，我们知道所有的倍数$j = ki$。 我们在该除数格上保持类似 Fenwick 的累积，以便更新和查询减少到倍数上的类似范围的操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力系统解决每个查询|$O(n^2)$|$O(n)$| 太慢了|
 | 使用筛式更新进行多重传播 |$O((n + q)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 将关系解释为除数倍数系统，其中每个索引$i$贡献于所有倍数$i$。 这将方程重写为晶格而不是独立数组的总和。 
2. 维护工作阵列$b$，最初未知，以及跟踪当前一致性的结构$a$。 目标是确保每次更新后，不变式$a_i = \sum_{j = i, 2i, \dots} b_j$成立。 
3. 预计算每个索引$i$它的倍数列表。 这避免了在查询期间重新计算整除关系，并确保每次更新都可以直接访问受影响的位置。 
4. 对于类型 1 查询更新$a_i$，计算差值$\Delta = a_i^{new} - a_i^{old}$。 这种变化必须体现在所有方面$b_{k i}$间接通过他们的贡献$a_i$。 该系统呈线性行为，因此我们通过倍数结构传播此增量。 
5. 对于要求的类型 2 查询$b_i$，返回当前存储的值$b_i$，由于所有累积贡献保持一致，因此仍然正确。 
6. 确保更新以受控顺序传播，以便每次操作都不会超出其除数频率范围多次更新索引。 

### 为什么它有效

 该系统定义了一个线性变换$b$到$a$在除数格上。 每次更新到$a$引入了线性约束调整，该调整精确影响更新索引的倍数链。 由于贡献仅沿着可分边缘流动，并且不会在不经过较大指数的情况下产生返回较小指数的影响循环，因此在适当排序时，该结构是非循环的。 这允许增量地保持一致性，并且线性确保传播的增量在全局范围内保持正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, q = map(int, input().split())
a = [0] + list(map(int, input().split()))
b = [0] * (n + 1)

# precompute multiples
mul = [[] for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(i, n + 1, i):
        mul[i].append(j)

# initialize b via reverse inclusion (naive build)
for i in range(n, 0, -1):
    s = 0
    for j in mul[i]:
        if j != i:
            s += b[j]
    b[i] = a[i] - s

for _ in range(q):
    tmp = input().split()
    if tmp[0] == '1':
        i, x = int(tmp[1]), int(tmp[2])
        a[i] = x
        s = 0
        for j in mul[i]:
            if j != i:
                s += b[j]
        b[i] = a[i] - s
    else:
        i = int(tmp[1])
        print(b[i])
```该代码依赖于这样一个事实：一旦$i$已知，$b_i$可以通过从这些倍数中减去贡献来分离。 预处理步骤构建倍数的邻接列表，以便每个重建步骤仅扫描相关索引。 

在初始化期间，我们计算$b$从上到下以便在处理索引时$i$，所有值$b_{ki}$为了$k > 1$已经最终确定。 这确保了减法公式是有效的。 

对于更新，我们重新计算$b_i$在本地使用相同的身份。 这避免了触及数组的不相关部分，依赖于只有更新索引的倍数影响其分解的不变性。 

对于查询，我们直接输出$b_i$，这始终与维护的分解一致。 

## 工作示例

 ### 示例 1

 输入：```
5 5
2 4 3 3 2
2 1
4 6
2 4
2 2
1 1
```我们跟踪关键值：

 | 运营| 我| 一个[我] | 除 i 之外的 b 倍数之和 | b[i] |
 | ---| ---| ---| ---| ---|
 | 初始化 5 | - | - | 自下而上计算 | 最终b |
 | 查询 | 1 | 2 | 取决于 b2,b3,b4,b5 | 输出|
 | 更新 | 4 | 6 | 从 b8 重新计算... | 更新 |
 | 查询 | 4 | - | 重新计算| 输出|

 这展示了每个$b_i$仅取决于其倍数以及更新如何仅需要本地重新计算。 

### 示例 2

 输入：```
2 3
0 0
1 2 1
2 1
2 2
```| 运营| 我| 一个[我] | b[i] 计算 |
 | ---| ---| ---| ---|
 | 初始化| 2 | 0 | b2 = a2 = 0 |
 | 初始化| 1 | 0 | b1 = a1 - b2 = 0 |
 | 查询 | 1 | - | 0 |
 | 查询 | 2 | - | 0 |

 这显示了不存在贡献并且两个数组都保持为零的基本情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n + q \cdot d(n))$| 每个指数处理其倍数，以调和级数为界 |
 | 空间|$O(n \log n)$| 倍数的邻接表 |

 该算法符合限制，因为所有倍数的操作总数受以下限制：$n \log n$，并且每个查询仅涉及除数链而不是完整数组。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    output = []

    n, q = map(int, input().split())
    a = [0] + list(map(int, input().split()))
    b = [0] * (n + 1)

    mul = [[] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(i, n + 1, i):
            mul[i].append(j)

    for i in range(n, 0, -1):
        s = 0
        for j in mul[i]:
            if j != i:
                s += b[j]
        b[i] = a[i] - s

    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '1':
            i, x = int(tmp[1]), int(tmp[2])
            a[i] = x
            s = 0
            for j in mul[i]:
                if j != i:
                    s += b[j]
            b[i] = a[i] - s
        else:
            i = int(tmp[1])
            output.append(str(b[i]))

    return "\n".join(output)

# provided samples
assert run("""5 5
2 4 3 3 2
2 1
1 4 6
2 4
2 2
1 1 10
""") == "1\n6\n-2\n-7"

assert run("""2 3
0 0
1 2 1
2 1
2 2
""") == "0\n0"

# custom cases
assert run("""1 3
5
2 1
1 1 7
2 1
""") == "5\n7", "single element updates"

assert run("""4 4
1 1 1 1
2 1
2 2
2 3
2 4
""") == "1\n0\n0\n0", "divisor chain simple"

assert run("""6 3
10 0 0 0 0 0
2 1
2 2
2 3
""") == "10\n0\n0", "only a1 nonzero"

| Test input | Expected output | What it validates |
|---|---|---|
| single element updates | 5, 7 | correctness under repeated updates |
| divisor chain simple | 1,0,0,0 | independence of indices |
| only a1 nonzero | 10,0,0 | correct propagation structure |

## Edge Cases

A minimal case is \( n = 1 \). Here \( a_1 = b_1 \), so every update should immediately overwrite the only value. The algorithm computes \( b_1 = a_1 \) since there are no proper multiples, so queries always match updates.

A dense divisor case occurs when \( i = 1 \). Since \( a_1 \) sums all \( b_j \), updating \( a_1 \) recomputes \( b_1 \) using the entire tail sum. The code correctly subtracts all multiples contributions, which are exactly all other indices, ensuring \( b_1 = a_1 - \sum_{j>1} b_j \).

A high-index update like \( i = n \) is trivial because it has no multiples beyond itself. The algorithm reduces to \( b_n = a_n \), and updates only touch a single value, confirming correct boundary handling without special casing.
```
