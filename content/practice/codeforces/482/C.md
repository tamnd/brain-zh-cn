---
title: "CF 482C - 弦乐游戏"
description: "我们提前知道所有候选字符串。 其中之一是统一随机选择的。 我们通过询问角色位置来揭示信息。 问题的顺序不是有策略地选择的。 在每一步中，我们都会从尚未询问的职位中统一挑选。"
date: "2026-06-07T17:20:13+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 482
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 275 (Div. 1)"
rating: 2600
weight: 482
solve_time_s: 222
verified: true
draft: false
---

[CF 482C - 字符串游戏](https://codeforces.com/problemset/problem/482/C)

 **评分：** 2600
 **标签：** 位掩码、dp、概率
 **求解时间：** 3m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们提前知道所有候选字符串。 其中之一是统一随机选择的。 我们通过询问角色位置来揭示信息。 

问题的顺序不是有策略地选择的。 在每一步中，我们都会从尚未询问的职位中统一挑选。 

在某些位置被揭示后，一些字符串可能仍然与迄今为止看到的所有答案兼容。 一旦只剩下一根绳子，游戏就会停止。 我们必须计算预期提出的问题数量。 

关键参数以非常具体的方式很小。 最多有 50 个字符串，但字符串长度最多为 20。长度为 20 立即表明位置子集是可管理的，因为$2^{20} = 1{,}048{,}576$。 虽然很大，但对于精心设计的位掩码 DP 来说仍然可以实现。 另一方面，任何涉及任意字符串子集的状态都是不可能的，因为可能有 50 个字符串。 

一个微妙的点是，随机过程仅取决于已经询问的位置，而不取决于询问的顺序。 一旦知道了一组位置，剩下的候选字符串就完全确定了。 

一些边缘情况很容易被错误处理。 

考虑单个字符串：```
1
abc
```正确答案是 0。在询问任何内容之前，所选字符串已经已知。 盲目地假设至少需要一个问题的解决方案将会失败。 

考虑两个字符串仅在一个位置不同：```
2
aab
aac
```游戏可能需要 1、2 或 3 个问题，具体取决于询问区别位置的时间。 仅计算区别位置并忽略随机排序的解决方案将产生错误的期望。 

考虑只有在组合多个位置的信息后才能区分的字符串：```
3
ab
ac
cb
```没有一个位置可以唯一地标识每个字符串。 DP 必须跟踪整套已披露的职位，而不仅仅是已披露的职位数量。 

## 方法

 蛮力视图很简单。 设状态为：

 - 选择的字符串，
 - 已询问的一组位置。 

从这样的状态我们可以确定该字符串是否已经被唯一标识。 如果没有，我们随机选择一个未询问的位置并继续递归。 

这给出了正确的递归，但状态空间包含$$n \cdot 2^m$$州。 和$n=50$和$m=20$，即超过五千万个州。 即使存储它们也是不切实际的。 

解决这个问题的观察结果是，我们实际上从来不需要为不同的所选字符串提供单独的 DP 值。 

修复一组已询问的位置$M$。 

对于特定的字符串$i$，如果至少一个其他字符串仍然与 中位置的所有答案一致，则将其定义为未解决$M$。 

认为$F(M)$是所有可能选择的字符串的预期剩余问题的总和。 

对于每个未解析的字符串，我们必须在进入子状态之前再花费一个问题。 对于每个已解析的字符串，期望值已经为零。 

这允许我们编写仅涉及位置掩码的递归$M$。 所选字符串从 DP 状态中完全消失。 

剩下的挑战是针对每个掩模的计算$M$，有多少字符串未解析。 这就是小字符串长度变得有用的地方。 

对于两个字符串$i$和$j$， 让`diff(i,j)`是它们不同的位置的集合。 

询问位置后仍然无法区分$M$就在这些不同的立场都没有被揭露的时候：$$M \cap diff(i,j)=\varnothing$$等价地，$$M \subseteq (\text{all positions}) \setminus diff(i,j)$$这成为一个经典的子集 SOS 传播问题$2^m$面具。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对（字符串、掩码）状态进行暴力破解 |$O(n2^m m)$状态和转换|$O(n2^m)$| 太慢了|
 | 位掩码 DP + SOS 传播 |$O(m2^m)$|$O(2^m)$| 已接受 |

 ## 算法演练

 1. 将位置从 0 到$m-1$。 
2. 对于每个有序的不同字符串对$(i,j)$，构建一个掩码`sameMask`包含两个字符串相等的位置。 

如果当前显示的位置是以下位置的子集`sameMask`，然后是字符串$i$和$j$仍然无法区分。 
3. 创建数组`alive[mask]`64 位位集。 

对于每一个订购的对$(i,j)$, 设置位`i`里面`alive[sameMask]`。 

这记录了该字符串`i`每当显示位置掩码是以下子集时就无法解决`sameMask`。 
4. 运行从超集到子集的 SOS 传播。 

传播后，`alive[M]`恰好包含在显示位置后仍未解析的字符串集`M`。 

传播之所以有效是因为`sameMask`继承了不可区分关系。 
5. 定义$$K(M)=\text{number of set bits in } alive[M]$$这是尚未唯一标识的字符串数量。 
6.让`dp[M]`是当位置时所有可能选择的字符串的预期剩余问题的总和`M`已经被揭晓了。 
7. 按降序处理掩模。 

如果`rem`职位仍未被询问，然后$$dp[M] = K(M) + \frac{1}{rem} \sum_{p \notin M} dp[M \cup \{p\}]$$第一项为每个未解决的字符串贡献一个问题。 第二项对下一个位置的随机选择进行平均。 
8.全掩码状态没有孩子。 它的价值简直就是`K(fullMask)`，为零。 
9. 所需答案是$$\frac{dp[0]}{n}$$因为`dp[0]`是所有同样可能选择的字符串的期望总和。 

### 为什么它有效

 对于固定显示位置掩模$M$，每个选定的字符串都属于两个类别之一。 

如果它已经被唯一标识，则其剩余期望为零。 

如果它没有被唯一地识别，则在转向在剩余位置中统一选择的子掩码之前再询问一个问题。 

对所有字符串求和这些方程可得出以下递归式`dp[M]`。 不再需要有关单个所选字符串的信息； 只有未解析字符串的数量才重要。 

SOS 阶段正确计算未解析的字符串，因为当所有显示的位置都属于其相等掩码时，两个字符串仍然无法精确区分。 将信息从掩码传播到其所有子集会准确地枚举那些显示的位置集。 

这两个事实一起完整地描述了随机过程，因此 DP 计算出精确的期望。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n = int(input())
    s = [input().strip() for _ in range(n)]

    m = len(s[0])
    N = 1 << m
    full = N - 1

    alive = array('Q', [0]) * N

    for i in range(n):
        for j in range(n):
            if i == j:
                continue

            same_mask = 0
            si = s[i]
            sj = s[j]

            for k in range(m):
                if si[k] == sj[k]:
                    same_mask |= 1 << k

            alive[same_mask] |= (1 << i)

    for b in range(m):
        bit = 1 << b
        for mask in range(N):
            if (mask & bit) == 0:
                alive[mask] |= alive[mask | bit]

    pc = bytearray(N)
    for mask in range(1, N):
        pc[mask] = pc[mask >> 1] + (mask & 1)

    dp = array('d', [0.0]) * N

    for mask in range(full, -1, -1):
        unresolved = alive[mask].bit_count()

        rem = m - pc[mask]
        if rem == 0:
            dp[mask] = float(unresolved)
            continue

        total = 0.0
        free = full ^ mask

        while free:
            bit = free & -free
            total += dp[mask | bit]
            free ^= bit

        dp[mask] = unresolved + total / rem

    print("{:.15f}".format(dp[0] / n))

solve()
```这`alive`数组是预处理的核心。 每个条目存储一个 64 位位集，因为$n \le 50$，因此每个字符串都适合一个机器字。 

SOS 传播将信息从掩码移动到其所有子集。 完成后，`alive[M]`已经包含该显示位置掩码的一组确切的未解析字符串。 

DP 以反向掩码顺序运行。 每个转换都会进入严格的超集，因此所有子状态都已计算完毕。 

一个容易出错的实现细节是对`K(M)`。 它不是剩余的候选字符串的数量。 它是所选的尚未解析的字符串的数量。 这些是不同的数量。 

另一个微妙之处是有序对的使用。 如果字符串`i`仍然可能与字符串混淆`j`，然后字符串`i`必须标记为未解决。 反方向也必须单独记录。 

## 工作示例

 ### 示例 1

 输入：```
2
aab
aac
```这些字符串仅在位置 2 处不同。 

| 面膜| 公开职位 | 未解析的字符串 K(mask) |
 | ---| ---| ---|
 | 000 | 000 无 | 2 |
 | 001| 位置 0 | 2 |
 | 010| 位置 1 | 2 |
 | 100 | 100 位置 2 | 0 |
 | 111 | 111 全部 | 0 |

 DP值：

 | 面膜| 雷姆 | DP |
 | ---| ---| ---|
 | 111 | 111 0 | 0 |
 | 110 | 110 1 | 0 |
 | 101 | 101 1 | 0 |
 | 011| 1 | 2 |
 | 100 | 100 2 | 0 |
 | 010| 2 | 3 |
 | 001| 2 | 3 |
 | 000 | 000 3 | 4 |

 答案是：$$dp[0]/2 = 2$$与样本相匹配。 

该轨迹表明 DP 正在同时对两个可能选择的字符串求和。 

### 示例 2

 输入：```
3
ab
ac
cb
```| 面膜| 公开职位 | K（掩模）|
 | ---| ---| ---|
 | 00 | 00 无 | 3 |
 | 01 | 第一位置 | 2 |
 | 10 | 10 第二名 | 2 |
 | 11 | 11 两个职位 | 0 |

 DP计算：

 | 面膜| 雷姆 | DP |
 | ---| ---| ---|
 | 11 | 11 0 | 0 |
 | 10 | 10 1 | 2 |
 | 01 | 1 | 2 |
 | 00 | 00 2 | 5 |

 最终答案：$$5/3$$这个例子表明，一个公开的职位并不总是足够的，即使它消除了一些候选人。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(m2^m)$| SOS 传播和 DP 分别处理每个位置的每个掩模 |
 | 空间|$O(2^m)$| Bitset 数组、popcount 数组和 DP 数组 |

 和$m \le 20$，我们最多有$2^{20} = 1{,}048{,}576$面具。 内存使用量和操作数量都在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from array import array

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    s = [input().strip() for _ in range(n)]

    m = len(s[0])
    N = 1 << m
    full = N - 1

    alive = array('Q', [0]) * N

    for i in range(n):
        for j in range(n):
            if i == j:
                continue

            same_mask = 0
            for k in range(m):
                if s[i][k] == s[j][k]:
                    same_mask |= 1 << k

            alive[same_mask] |= (1 << i)

    for b in range(m):
        bit = 1 << b
        for mask in range(N):
            if (mask & bit) == 0:
                alive[mask] |= al
```
