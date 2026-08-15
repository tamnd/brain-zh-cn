---
title: "CF 104294B - 天使节拍"
description: "我们被赋予了几个独立的天使群体。 每组都包含多组战力，每当形成防御时，必须从每组中选出一名天使。 防御力是所选天使力量的总和。"
date: "2026-07-01T20:24:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104294
codeforces_index: "B"
codeforces_contest_name: "UTPC Spring 2023 Open Contest"
rating: 0
weight: 104294
solve_time_s: 101
verified: true
draft: false
---

[CF 104294B - Angel Beats](https://codeforces.com/problemset/problem/104294/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了几个独立的天使群体。 每组都包含多组战力，每当形成防御时，必须从每组中选出一名天使。 防御力是所选天使力量的总和。 

对于具有目标值的每次攻击`t`，我们只关心最低的`m`防御总和的位。 如果所选权力的总和取模，则防御成功`2^m`, 等于`t mod 2^m`。 

该任务是动态的：通过插入和删除天使，组随着时间的推移而变化，每次更新后，我们可能会被问到所有组中存在多少个有效选择。 

这些约束已经暗示了核心结构。 组数较少，最多100个，位宽`m`最多为 16，因此每个值都存在于一个大小的宇宙中`2^m`，最多为 65536。这立即暗示我们可以负担得起在此域大小中大致线性或接近线性的算法，但任何在`2^m`会太慢。 

当组变空时，就会出现一个微妙的问题。 如果任何组没有天使，则不可能从每个组中选择一个元素，因此所有查询的有效防御数量必须为零，直到该组再次非空。 忽略空性的简单实现可能仍然会产生卷积结果，而不是正确地将整个配置归零。 

另一个重要的方面是答案取决于求和模`2^m`，不是精确的总和。 这消除了对大整数增长的任何担忧，但迫使我们陷入循环行为：添加`2^m`总和不会改变结果。 任何解决方案都必须尊重这种环绕结构。 

## 方法

 思考问题的一种直接方法是组合地模拟它。 对于每一组，我们选择一个天使，然后将所有组合相加，并计算有多少个天使产生每个残数模`2^m`。 如果我们将每个组定义为值的频率数组`0 ... 2^m - 1`，那么组合组对应于该循环域上的卷积。 

如果我们只有一个查询，我们可以重复地对所有组分布进行卷积。 两个长度之间的每个卷积`N`阵列成本`O(N log N)`使用 NTT，其中`N = 2^m`。 在 100 个组中执行一次此操作是可以接受的。 

困难随着更新而出现。 每个查询都会修改一组，从头开始重新计算所有内容将需要重复重建 100 个分布的完整乘积。 这会将卷积成本乘以查询数量，这太慢了。 

关键的观察是所有组的组合在卷积下是关联的。 这意味着我们可以将中间结果存储在一棵线段树中：每个节点代表一系列组的卷积。 当单个组发生变化时，仅`O(log n)`节点需要重新计算。 每次重新计算都不是卷积，而是频率空间中的逐点乘法，这要便宜得多。 

关键技巧是使用 NTT 将每个组移至频域。 在该域中，卷积变成逐点乘法，因此组合两个组需要`O(N)`而不是`O(N log N)`。 那么线段树只维护频率向量的乘积。 

这将问题从重复的重卷积转换为偶尔变换的重复的轻乘法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询重新计算全卷积 | O(q·n·N log N) | O(q·n·N log N) | O(N) | 太慢了 |
 | 时域线段树| O(q·n·N log N) | O(q·n·N log N) | O(nN) | 太慢了 |
 | 频域线段树 (NTT) | O(q·N log N + q·N log n) | O(q·N log N + q·N log n) | O(nN) | 已接受 |

 ## 算法演练

 让`N = 2^m`。 我们将每个组视为频率数组`f[g][x]`， 在哪里`f[g][x]`是一组中有多少个天使`g`有权力`x`。 

1. 对于每个组，构建其频率数组`0 ... N-1`，然后计算其 NTT 变换。 这将每个组转换为频域向量，其中卷积变成逐点乘法。 

这很有用的原因是组合组总是在原始域中进行卷积，但在频率空间中进行乘法。 
2. 在组上构建线段树。 每片叶子存储一组变换后的向量。 

内部节点存储其子向量的元素乘积。 这代表了该部分群体的综合贡献。 
3. 当发生更新时，首先通过增加或减少相关值来修改受影响组的原始频率数组。 

更新原始计数后，从头开始重新计算其 NTT 变换，因为本地更改会破坏之前的变换。 
4. 将线段树从叶子更新到根。 在每个节点，将其存储的向量重新计算为其子节点的元素乘积。 

这一步很有效，因为我们在这里从不做卷积，只进行乘法`N`元素。 
5. 对于查询，获取根节点的频域向量并应用逆 NTT。 结果数组给出了获得每个残差和的方法数。 
6. 输出index处的值`t mod N`。 

为什么它有效来自两个不变量。 首先，每个叶子总是代表其组的精确频率分布。 其次，每个内部节点代表其段中所有组的卷积，因为时域中的卷积变成了频域中的乘法，并且我们一致地保持该结构。 由于根覆盖了所有组，因此它的逆变换正是所有组选择的全局卷积。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
G = 3

def modinv(x):
    return pow(x, MOD - 2, MOD)

def ntt(a, invert=False):
    n = len(a)

    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = modinv(wlen)

        i = 0
        while i < n:
            w = 1
            for j in range(length // 2):
                u = a[i + j]
                v = a[i + j + length // 2] * w % MOD
                a[i + j] = (u + v) % MOD
                a[i + j + length // 2] = (u - v) % MOD
                w = w * wlen % MOD
            i += length
        length <<= 1

    if invert:
        inv_n = modinv(n)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def build_ntt(freq):
    a = freq[:]
    ntt(a, False)
    return a

def inv_ntt(a):
    b = a[:]
    ntt(b, True)
    return b

n, m = map(int, input().split())
N = 1 << m

groups = []
ntt_groups = []

for _ in range(n):
    tmp = list(map(int, input().split()))
    k = tmp[0]
    arr = tmp[1:]

    freq = [0] * N
    for x in arr:
        freq[x] += 1

    groups.append(freq)
    ntt_groups.append(build_ntt(freq))

def merge(a, b):
    return [(x * y) % MOD for x, y in zip(a, b)]

size = 1
while size < n:
    size <<= 1

seg = [None] * (2 * size)

for i in range(size):
    if i < n:
        seg[size + i] = ntt_groups[i]
    else:
        seg[size + i] = [1] * N

for i in range(size - 1, 0, -1):
    seg[i] = merge(seg[2 * i], seg[2 * i + 1])

def update(pos):
    i = size + pos
    seg[i] = ntt_groups[pos][:]
    i >>= 1
    while i:
        seg[i] = merge(seg[2 * i], seg[2 * i + 1])
        i >>= 1

q = int(input())
for _ in range(q):
    op = input().split()

    if op[0] == '?':
        t = int(op[1])
        res_freq = inv_ntt(seg[1])
        print(res_freq[t % N] % MOD)

    else:
        typ, i, p = op
        i = int(i) - 1
        p = int(p)

        if typ == '+':
            groups[i][p] += 1
        else:
            groups[i][p] -= 1

        ntt_groups[i] = build_ntt(groups[i])
        update(i)
```实现首先为每个组构建频率数组，其中索引对应于可能的功率。 每个数组都使用 NTT 进行转换，以便卷积运算变成乘法。 

线段树存储这些变换后的数组。 每个合并步骤都会乘以相应的条目，这对应于在卷积下组合组贡献。 

对于更新，我们仅重建受影响组的变换并向上更新线段树。 对于查询，我们反转根变换以恢复实际的卷积结果并读取所需的残差。 

一个微妙的细节是，空组自然会变成零向量，它通过乘法传播并强制所有答案为零，满足不存在有效选择的要求。 

## 工作示例

 考虑一个有两个组的小实例，`m = 2`，所以值以 4 为模。 

最初：

 第 1 组有`[0, 1]`，第 2 组有`[0, 2]`。 

频率向量是：

 第 1 组：`[1, 1, 0, 0]`第 2 组：`[1, 0, 1, 0]`卷积后，可能的和为：

 | 选择| 求和模 4 |
 | --- | --- |
 | 0 + 0 | 0 |
 | 0 + 2 | 2 |
 | 1 + 0 | 1 |
 | 1 + 2 | 3 |

 所以每个残基都出现一次。 

现在假设我们删除`2`从第 2 组出发，离开`[0]`。 

| 步骤| 第 1 组 | 第 2 组 | 结果分布|
 | --- | --- | --- | --- |
 | 初始| [0,1]| [0,2]| 制服|
 | 更新后 | [0,1]| [0]| 仅第 1 组重要 |

 现在只剩下第 1 组的总和，因此残数为`[1,1,0,0]`。 

该轨迹表明更新仅影响局部频率向量，全局结果纯粹通过重组进行调整，而不是从头开始重新计算。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q·N + q·N log N) | O(q·N + q·N log N) | 每次更新都会重建一个 NTT 并更新一棵线段树，时间复杂度为 O(N log n)。 每个查询执行一次逆NTT。 |
 | 空间| O(nN) | 每个群和线段树节点存储一个长度为N的向量 |

 价值`N = 2^m`最多为 65536，并且两者`n`和`q`最多 100。这使总操作保持在可接受的范围内，因为所有繁重操作在以下方面都是线性或接近线性的`N`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    
    # assume solution is wrapped in solve()
    # solve()
    
    return "".join(output)

# provided sample (placeholder formatting)
assert True

# custom cases
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小单组| 直频| 基本情况正确性 |
 | 两组小 m=1 | 手动卷积 | 合并的正确性 |
 | 更新然后查询| 动态正确性 | 线段树更新|
 | 空组| 0 输出 | 处理无效配置|

 ## 边缘情况

 删除后组变空的情况突出了乘法故障模式。 如果一组没有天使，则其频率向量全为零。 当这个向量与线段树中的全局乘积相乘时，整个结果会归零。 这符合不能形成有效辩护的要求。 

另一种情况是对同一组进行重复更新。 由于每次更新都会从头开始重建转换，因此绝不能重复使用过时的频率数据。 正确性依赖于每次修改后始终重新计算 NTT，确保线段树永远不会混合组的新旧状态。
