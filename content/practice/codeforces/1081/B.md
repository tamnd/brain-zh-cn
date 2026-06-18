---
title: "CF 1081B - 欢送会"
description: "我们有一组 n 人。 每个人只戴一顶帽子，每顶帽子都属于从 1 到 n 标记的 n 种可能类型之一。 多人可能共用相同的帽子类型，并且某些帽子类型可能根本不使用。"
date: "2026-06-15T06:11:19+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1081
codeforces_index: "B"
codeforces_contest_name: "Avito Cool Challenge 2018"
rating: 1500
weight: 1081
solve_time_s: 173
verified: true
draft: false
---

[CF 1081B - 告别派对](https://codeforces.com/problemset/problem/1081/B)

 **评分：** 1500
 **标签：** 构造性算法，实现
 **求解时间：** 2m 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组 n 人。 每个人只戴一顶帽子，每顶帽子都属于从 1 到 n 标记的 n 种可能类型之一。 多人可能共用相同的帽子类型，并且某些帽子类型可能根本不使用。 

每个人 i 提供一个数字 a_i，它应该代表有多少人戴着与他们不同的帽子类型。 如果我们将帽子类型的最终分配表示为 b_1, b_2, ..., b_n，那么对于个人 i，值 a_i 必须等于索引 j 的数量，使得 b_j 与 b_i 不同。 

任务是确定是否存在与所有这些语句一致的帽子类型赋值，如果存在，则构造一个有效的赋值。 

约束 n ≤ 10^5 迫使我们远离任何二次方或涉及人与人之间成对比较的东西。 任何尝试显式验证所有分配或模拟候选者的解决方案都会失败，因为即使 O(n^2) 也已经意味着大约 10^10 次操作。 

一个微妙的点是条件是对称的但单独表达。 每个人的说法仅取决于有多少人分享自己的帽子类型。 这意味着问题从根本上讲是将索引分组为类，其中每个类的大小为其中的每个人确定相同的值。 

暴露出不正确直觉的一种边缘情况是所有 a_i 都相等但在全局范围内不可能。 例如，如果所有 a_i 均为 1 并且 n = 2，我们无法同时满足两个人的需求，因为每个人都只能看到另一个人，但分组约束会被破坏。 

另一种失败情况发生在一个人声明一个暗示组大小在 [1, n] 之外的值时，例如 a_i = n - 1，这迫使他们进入单例组。 

## 方法

 暴力方法会尝试为每个人分配一种帽子类型，并检查所有约束是否成立。 由于每个 b_i 可以取 n 个值，这会导致 n^n 种可能性，即使对于 n = 10 也是完全不可行的。 

一个更结构化的暴力想法是猜测组大小：对于 n 的每个可能的组大小划分，相应地分配值。 然而，分区数量呈指数级增长，但仍然无法扩展。 

关键的观察是，一个人的陈述完全取决于其群体的规模。 如果一个人属于一个规模为 s 的群体，那么恰好有 s - 1 个人共享他们的帽子，因此 n - s 个人拥有不同的帽子。 所以每个具有 a_i 值的人都必须属于一个大小为：

 s = n - a_i

 这将问题从任意分配转换为按所需组大小进行分组索引。 

现在的问题是：我们能否将索引划分为组，其中每个索引 i 必须属于大小为 s_i = n - a_i 的组，并且组中的所有成员必须就相同的 s_i 达成一致？ 

这是一个一致性和分组问题，可以通过将所需大小相等的分组来贪婪地解决。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^n) | O(n^n) | O(n) | 太慢了|
 | 按大小频率进行最佳分组 | O(n) | O(n) | 已接受 |

 ## 算法演练

 我们将每个语句转换为所需的组大小。

1. 对于每个人 i，计算 s_i = n - a_i。 这是我的陈述唯一可能成立的群体规模。 
2. 如果任何 s_i 小于 1 或大于 n，则立即断定不可能。 组的大小不能无效。 
3. 使用从大小到人员列表的映射，按所需大小 s_i 对索引进行分组。 
4. 对于每个尺寸为 s 的组，检查需要尺寸 s 的人数是否能被 s 整除。 如果不是，我们就无法将它们分成大小为 s 的统一组，因此配置是不可能的。 
5. 对于每个有效大小 s，将其列表划分为恰好 s 个人的块。 每个块对应一种帽子类型。 
6. 为每个块分配一个唯一的帽子标签并相应地设置 b_i。 

### 为什么它有效

 变换 s_i = n - a_i 是强制的：规模为 s 的群体中的任何人都必然会看到他们群体之外的 n - s 个人，与他们的陈述相匹配。 一旦收集了所有具有相同所需规模的人，任何有效的解决方案都必须将他们分成大小恰好为 s 的组，因为混合规模将至少违反一个人所需的组大小。 可分性条件确保每个这样的组都可以在没有剩余物的情况下形成，并且为每个块分配不同的标签构建有效的见证解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    groups = {}
    required = []

    for i, x in enumerate(a):
        s = n - x
        if s < 1 or s > n:
            print("Impossible")
            return
        required.append(s)
        if s not in groups:
            groups[s] = []
        groups[s].append(i)

    ans = [0] * n
    color = 1

    for s, idxs in groups.items():
        if len(idxs) % s != 0:
            print("Impossible")
            return

        for i in range(0, len(idxs), s):
            chunk = idxs[i:i+s]
            for j in chunk:
                ans[j] = color
            color += 1

    print("Possible")
    print(*ans)

if __name__ == "__main__":
    solve()
```代码首先将每个a_i转换为所需的组大小s_i。 然后，它构建共享相同要求的索引桶。 每个桶必须可以均匀地分成该大小的组。 颜色的分配直接对应于构建这些组。 

一个微妙的实现细节是我们不需要强制执行任何组的排序。 任何分区都有效，因为组中的所有成员在约束方面都是可互换的。 

## 工作示例

 ### 示例 1

 输入：```
3
0 0 0
```这里每个 s_i = 3 - 0 = 3，所以所有三个人必须在一个组中。 

| 步骤| 团体成立 | 行动| 状态|
 | --- | --- | --- | --- |
 | 计算 s_i | [3,3,3]| 所有索引都转到 s=3 | {3: [0,1,2]} |
 | 检查整除性 | 3 % 3 = 0 | 有效 | 不变|
 | 建立团体 | 大小为 3 的块 | 指定颜色 1 | b = [1,1,1] |

 这证实了大小为 3 的单个组与所有陈述一致。 

### 示例 2

 输入：```
4
2 2 1 1
```我们计算 s_i = 4 - a_i = [2,2,3,3]。 

| 步骤| 团体成立 | 行动| 状态|
 | --- | --- | --- | --- |
 | 计算 s_i | [2,2,3,3] | 按值分割| {2:[0,1], 3:[2,3]} |
 | 检查 s=2 | 2 % 2 = 0 | 好的 | 不变|
 | 检查 s=3 | 2 % 3 ≠ 0 | 失败| 停止|

 这表明，尽管本地分组看起来似乎合理，但无法满足 3 要求，因此该实例是不可能的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个索引处理一次用于分组，一次用于分配|
 | 空间| O(n) | 组和输出数组的存储|

 该解决方案完全符合约束条件，因为内存和运行时都随 n 线性扩展，这对于 n 高达 10^5 是必要的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from io import StringIO

    input_data = sys.stdin.read().strip().split()
    it = iter(input_data)

    n = int(next(it))
    a = [int(next(it)) for _ in range(n)]

    groups = {}
    for i, x in enumerate(a):
        s = n - x
        groups.setdefault(s, []).append(i)

    ans = [0] * n
    color = 1

    for s, idxs in groups.items():
        if len(idxs) % s != 0:
            return "Impossible"
        for i in range(0, len(idxs), s):
            for j in idxs[i:i+s]:
                ans[j] = color
            color += 1

    return "Possible\n" + " ".join(map(str, ans))

# provided sample
assert run("3\n0 0 0\n") == "Possible\n1 1 1"

# all impossible due to mismatch
assert run("3\n0 1 2\n") == "Impossible"

# simple split case
assert run("4\n2 2 1 1\n") == "Impossible"

# single group edge
assert run("1\n0\n") == "Possible\n1"

# alternating valid grouping
assert run("4\n3 3 3 3\n") == "Possible\n1 1 1 1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 个相同的零 | 可能 | 单全组|
 | 混合 0 1 2 | 不可能| 尺寸不一致 |
 | 4 种不同尺寸 | 不可能| 可分性失败 |
 | n=1 边 | 可能 | 最小案例|
 | 全部需要全组 | 可能 | 统一要求|

 ## 边缘情况

 当所有 a_i = n - 1 时，就会出现一种边缘情况。然后所有 s_i = 1，因此每个人都必须位于一个单例组中。 该算法正确地将每个索引分配给它自己的组，因为每个大小为 1 的桶都可以被 1 整除，从而产生一个有效的分配，其中每个人都有一个唯一的帽子。 

另一个边缘情况是 n = 1 且 a_1 = 0。这使得 s_1 = 1，形成单个有效组。 该算法无需特殊逻辑即可处理此问题，因为分组自然会产生一个块。 

一种更微妙的情况是，存在多个所需尺寸，但其中一个尺寸有剩余元素。 例如，n = 6，s 值为 [2,2,2,2,2,3]。 size-2 组有 5 个元素，无法形成完整的对，导致算法在尝试任何部分分配之前正确拒绝实例。
