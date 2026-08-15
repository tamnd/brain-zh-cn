---
title: "CF 104312F - 龙珠"
description: "我们正在维护一个动态的“栖息地”集合，其中每个栖息地都存储着多条已命名的龙，并且每条龙都有独特的大小值。 随着时间的推移，系统支持两种操作。 一项行动将一条新龙放入选定的栖息地。"
date: "2026-07-01T19:53:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104312
codeforces_index: "F"
codeforces_contest_name: "UTPC Spring 2023 Contest (HS)"
rating: 0
weight: 104312
solve_time_s: 67
verified: true
draft: false
---

[CF 104312F - 龙珠](https://codeforces.com/problemset/problem/104312/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在维护一个动态的“栖息地”集合，其中每个栖息地都存储着多条已命名的龙，并且每条龙都有独特的大小值。 随着时间的推移，系统支持两种操作。 一项行动将一条新龙放入选定的栖息地。 另一个操作询问，对于给定的栖息地，哪条龙目前尺寸最小，哪条龙尺寸最大，并返回它们的名字。 

关键细节是栖息地逐渐演变。 每个查询都会反映所有先前插入后的状态。 没有删除，因此每个栖息地中的龙集只会增长。 

尽管大小很小（最多 100 个），但操作数量可能会很大。 这立即表明，如果许多龙聚集在一个地方，则为每个查询重复扫描栖息地中的所有龙将变得昂贵。 最坏的情况模式是将数千条龙插入一个栖息地，然后反复询问最小值和最大值，这将强制每次进行全面扫描。 

一种幼稚的方法是根据每次请求重建或重新扫描整个栖息地。 当同一栖息地积累了许多龙时，这种方法就会失败，因为每个查询都会以其当前大小变为线性，从而导致总体上二次行为。 

这里重要的边缘情况主要是关于重复查询和倾斜分布。 例如，如果所有操作都针对一个栖息地：

 输入：```
5
add A a 1
add A b 2
add A c 3
ask A
ask A
```一个简单的解决方案可能会通过扫描所有存储的龙来重新计算最小值和最大值，重复相同的工作两次。 这仍然是正确的，但大规模时效率低下。 

另一个微妙的情况是，尺寸非常小，但名称决定了身份。 由于名称是唯一的，因此我们不能依赖按名称排序或假设插入顺序的稳定性； 只有尺寸决定排序。 

## 方法

 蛮力策略为每个栖息地存储所有龙到达时的列表。 对于一个`add`，我们追加一条记录。 对于一个`ask`，我们扫描整个列表以按大小查找最小值和最大值。 这是正确的，因为每个查询都会显式地从头开始重新计算排序，确保我们始终返回最新的极值。 

然而，每个`ask`成本为 O(k)，其中 k 是当时该栖息地中的龙的数量。 如果所有操作都在一个栖息地上，其中一半是查询，那么在最坏的情况下总成本变为 O(n^2)，当 n 很大时，这太慢了。 

关键的观察是我们从来不需要完全排序，每个栖息地只需要两个极值元素。 这表明要逐步维持这些极端情况。 我们在插入元素时跟踪当前的最小值和最大值，而不是重新计算它们。 每次插入最多更新两个比较。 这将每个操作减少到 O(1)。 

我们还需要保留与这些极端相关的龙名称，因此每个栖息地的存储状态必须保留当前最佳候选者的大小和名称。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 我们维护一个以栖息地名称为键的字典。 每个值存储两条记录：当前最小龙（大小和名称）和当前最大龙。 

1. 初始化一个从栖息地名称到结构的空映射，其中 min 和 max 未定义。 

这确保了栖息地在第一次使用时被懒惰地创建。 
2. 对于每个`add`操作，提取栖息地名称、龙名称和大小。 

如果栖息地不存在，则初始化该龙的 min 和 max 。 
3. 如果栖息地已经存在，则将新的龙尺寸与存储的最小值进行比较。 如果较小，则更新最小记录。 

这保留了存储的最小值始终是迄今为止看到的最小的不变性。 
4. 将新的龙尺寸与存储的最大值进行比较。 如果更大，则更新最大记录。 

这可确保每次插入后最大值保持正确。 
5. 对于每个`ask`操作，直接输出存储的最小名称和最大名称。 

不需要扫描，因为结构始终保持最新。 

### 为什么它有效

 在每个时间点，每个栖息地都存储了两个值，总结了迄今为止看到的所有龙：最小的尺寸和最大的尺寸。 每个插入都会被处理一次，每当一条新龙可能影响任一极端时，我们都会立即更新它。 由于没有任何操作会删除龙或修改大小，因此一旦某个值变为最小值或最大值，它就会保持不变，除非稍后出现更极端的值。 这保证了查询时存储的对始终正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    habitats = {}

    for _ in range(t):
        parts = input().split()
        if parts[0] == "add":
            _, h, name, size = parts
            size = int(size)

            if h not in habitats:
                habitats[h] = {
                    "min_name": name,
                    "min_size": size,
                    "max_name": name,
                    "max_size": size
                }
            else:
                cur = habitats[h]

                if size < cur["min_size"]:
                    cur["min_size"] = size
                    cur["min_name"] = name

                if size > cur["max_size"]:
                    cur["max_size"] = size
                    cur["max_name"] = name

        else:
            _, h = parts
            cur = habitats[h]
            sys.stdout.write(cur["min_name"] + " " + cur["max_name"] + "\n")

if __name__ == "__main__":
    solve()
```该解决方案使用字典按栖息地名称对所有状态进行分组。 每个栖息地仅存储两条候选龙，因此内存使用量与插入数量保持线性关系。 

更新逻辑会小心地独立比较最小值和最大值的大小。 这种分离很重要，因为当同一条龙第一次插入栖息地时，它可能同时变成最小和最大。 

输出是使用写入的`sys.stdout.write`以避免重复打印调用带来的开销。 

## 工作示例

 ### 示例 1

 输入：```
add A x 5
add A y 2
add A z 8
ask A
ask A
```| 步骤| 运营| 最小 | 最大| 输出|
 | --- | --- | --- | --- | --- |
 | 1 | 添加 A x 5 | x(5) | x(5) | x(5) | x(5) | |
 | 2 | 添加 A y 2 | y(2) | y(2) | x(5) | x(5) | |
 | 3 | 添加 A z 8 | y(2) | y(2) | z(8) | z(8) | |
 | 4 | 问A | y | z | y z |
 | 5 | 问A | y | z | y z |

 这证实了重复查询不会重新计算状态，它们会重用维护的极值。 

### 示例 2

 输入：```
add B a 10
add B b 1
add B c 50
add B d 1
ask B
```| 步骤| 运营| 最小 | 最大| 输出|
 | --- | --- | --- | --- | --- |
 | 1 | 添加 B a 10 | 一个（10）| 一个（10）| |
 | 2 | 添加 B b 1 | b(1) | b(1) | 一个（10）| |
 | 3 | 添加 B c 50 | b(1) | b(1) | c(50) | 50 |
 | 4 | 添加 B d 1 | b(1) | b(1) | c(50) | 50 |
 | 5 | 问 B | 乙| c | BC |

 这表明，通过保持第一个观察到的极端值，可以自然地处理最小尺寸上的关系； 不需要特殊的平局打破。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t) | 每个操作都会更新或读取每个栖息地的恒定时间状态 |
 | 空间| O(h) | 每个栖息地存储两条龙的记录 |

 约束允许最多 100 次操作，但即使扩展得更高，该解决方案仍保持线性和高效。 恒定时间更新确保即使在密集操作下也不会出现瓶颈。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import defaultdict
    import sys

    input = sys.stdin.readline
    t = int(input())
    habitats = {}
    out = []

    for _ in range(t):
        parts = input().split()
        if parts[0] == "add":
            _, h, name, size = parts
            size = int(size)

            if h not in habitats:
                habitats[h] = {
                    "min_name": name,
                    "min_size": size,
                    "max_name": name,
                    "max_size": size
                }
            else:
                cur = habitats[h]
                if size < cur["min_size"]:
                    cur["min_size"] = size
                    cur["min_name"] = name
                if size > cur["max_size"]:
                    cur["max_size"] = size
                    cur["max_name"] = name
        else:
            _, h = parts
            cur = habitats[h]
            out.append(cur["min_name"] + " " + cur["max_name"])

    return "\n".join(out)

# provided sample
assert run("""9
add garden saladmander 5
add garden leekachu 6
add mountain coldasaur 8
ask garden
ask mountain
add garden myrtle 2
add lake fishy 3
ask garden
ask lake
""") == """saladmander leekachu
coldasaur coldasaur
myrtle leekachu
fishy fishy"""

# single element habitat
assert run("""2
add a dragon 10
ask a
""") == "dragon dragon"

# strictly increasing
assert run("""4
add a a 1
add a b 2
add a c 3
ask a
""") == "a c"

# alternating updates
assert run("""6
add a x 5
add a y 1
add a z 10
add a w 0
ask a
ask a
""") == """w z
w z"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一添加然后询问 | 龙龙| 单元素初始化 |
 | 增加尺寸| 一个c | 最大跟踪正确性|
 | 极端交替| w z | 两端重复更新|

 ## 边缘情况

 一个关键的边缘情况是栖息地中的第一条龙同时是最小值和最大值。 该算法将两个字段初始化为该龙，因此状态立即一致。 

输入：```
2
add x a 7
ask x
```执行将 min 和 max 设置为 (a, 7)，然后查询直接读取它们，产生`a a`。 

另一种情况是，随着时间的推移，一条新龙分别成为新的最小值或最大值。 

输入：```
4
add h a 5
add h b 1
add h c 10
ask h
```步骤 2 之后，b 变为最小值。 步骤3之后，c变为最大值。 该结构正确地独立跟踪两者，因此最终答案是`b c`。 

最后一个微妙的情况是重复询问而不干预添加。 由于查询期间不会发生重新计算，因此重复的输出保持相同，这符合查询操作时状态不会改变的要求。
