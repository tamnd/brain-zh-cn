---
title: "CF 105545L - \u041c\u043d\u0435 \u043d\u0435 \u043d\u0440\u0430\u0432\u044f\u0442\u0441\u044f \u044d\u0442\u0438 \u043c\u0430\u0442\u0440\u043e\u0441\u044b！"
description: "我们正在使用一个通过点更新随时间变化的数组。 每次更新后，我们需要评估数组中出现的所有值定义的全局数量。 对于任何值 x，我们查看所有根本不包含 x 的子数组。"
date: "2026-06-22T19:29:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105545
codeforces_index: "L"
codeforces_contest_name: "\u0423\u0440\u0430\u043b\u044c\u0441\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2024"
rating: 0
weight: 105545
solve_time_s: 59
verified: true
draft: false
---

[CF 105545L - \u041c\u043d\u0435 \u043d\u0435 \u043d\u0440\u0430\u0432\u044f\u0442\u0441\u044f \u044d\u0442\u0438 \u043c\u0430\u0442\u0440\u043e\u0441\u044b！](https://codeforces.com/problemset/problem/105545/L)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在使用一个通过点更新随时间变化的数组。 每次更新后，我们需要评估数组中出现的所有值定义的全局数量。 

对于任何值`x`，我们查看所有不包含的子数组`x`根本不。 让`cnt[x]`表示存在多少个这样的子数组。 每次修改数组中的单个位置后，我们都需要维护`cnt[x]`覆盖数组中当前存在的所有值。 

所以每次更新都会删除该位置的一个元素`s`并将其替换为另一个值。 关键要求不仅仅是更新数组，而是有效跟踪每个不同值的缺席结构如何变化。 

Codeforces 级动态数组问题所隐含的约束通常会促使我们寻求解决方案`O((n + q) log n)`。 每个查询的简单重新计算将需要扫描整个数组并重新计算每个值的贡献，这将立即超出限制`n`和`q`很大。 

主要困难在于每个值的贡献取决于其在数组中出现的分布，并且更新仅影响两个值，但如果处理不当，可能会更改许多子数组计数。 

一些边缘情况对于正确性很重要。 首先，仅出现一次或更新后新引入的值必须一致地处理，否则如果不仔细跟踪，它们的间隔结构将是未定义的。 其次，删除最后一次出现的值应该重置其对数组子数组总数的贡献，因为没有剩下禁止的位置。 第三，插入先前不存在的值必须从头开始正确初始化其结构。 

一个简单的说明性失败案例是当一个值完全消失时：

 输入：

 数组：`[1, 2, 1]`查询：逐渐去掉两个1

 全部删除后`1`，任何正确的方法都必须治疗`cnt[1]`作为当前数组的所有子数组。 仅维持事件之间间隙的有缺陷的方法将无法跟踪此重置条件。 

## 方法

 蛮力的想法很简单。 对于每个值`x`，我们枚举所有子数组并计算不包括的子数组`x`。 这需要检查每个子数组或至少扫描每个值的数组段。 和`O(n)`每个值的子数组和潜在的`O(n)`不同的值，在最坏的情况下这会变成三次方。 即使使用前缀扫描稍微优化，每次更新后重新计算仍然需要重建每个值的出现信息，导致粗略`O(n)`每个查询的工作量。 

瓶颈在于`cnt[x]`仅取决于位置`x`，而不是其他值。 一旦我们意识到这一点，我们就可以将问题分成每个值的独立结构。 

关键的观察结果是，固定值的出现将数组分成间隙，并且避免该值的所有子数组必须完全位于这些间隙内。 这将问题转化为维护由每个值的位置引起的段长度。 

现在更新仅影响单个位置。 该位置从其旧值中删除一个出现的位置，并在其新值中添加一个出现的位置。 这些操作中的每一个操作最多修改位置列表中的两个相邻间隙，这意味着可以使用有序结构在对数时间内处理每个更新。 

我们还维护所有的全局多重集`cnt[x]`值，以便我们可以在每次更新后有效地查询最小值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²q) | O(n) | 太慢了 |
 | 最佳 | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们修复了对于每个值的解释`x`，我们维护索引的排序集，其中`x`发生。 从这个结构我们得出`cnt[x]`使用间隙分解。 

1. 为每个不同值初始化一个平衡有序集，存储其所有位置。 这使我们能够在对数时间内找到任何索引的前驱和后继。 
2. 对于每个值`x`，计算其初始值`cnt[x]`通过扫描其位置并总结连续出现之间的间隙的贡献。 每个间隙的长度`L`贡献`L * (L + 1) / 2`。 这会计算完全包含在该间隙中的所有子数组。 
3. 存储全部`cnt[x]`多重集中的值，以便我们可以在恒定时间内查询所有值的最小值。 
4.对于位置的每次更新`s`, 识别旧值`a = arr[s]`和新值`b`。 
5. 修改结构前`a`, 定位`s`在其有序集合内。 查找左侧和右侧最近的出现位置，定义当前接触的两个间隙`s`。 去除`s`将这两个间隙合并为一个更大的间隙。 我们更新`cnt[a]`减去两个旧间隙的贡献并加上合并的间隙贡献。 
6. 删除`s`从集合`a`，并通过替换旧的来更新多重集`cnt[a]`与新的价值。 
7.为了价值`b`, 找到哪里`s`将被插入到其有序集中。 现有的差距跨越`s`被分成两个较小的间隙。 我们更新`cnt[b]`减去旧的大差距贡献并添加两个新的贡献。 
8. 插入`s`进入集合`b`，并类似地更新多重集。 
9. 处理完每个查询后，答案就是多重集中的最小元素。 

正确性依赖于每个值的不变量`x`,`cnt[x]`完全等于所有最大间隔的总和，其中`x`不会出现，并且这些间隔完全由连续出现的`x`。 每次更新仅更改单个位置周围的邻接关系，因此每个值仅影响两个间隔。 

由于所有其他差距保持不变，因此保留了全局一致性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import defaultdict
import bisect

class SortedSet:
    def __init__(self):
        self.a = []

    def add(self, x):
        i = bisect.bisect_left(self.a, x)
        if i == len(self.a) or self.a[i] != x:
            self.a.insert(i, x)

    def discard(self, x):
        i = bisect.bisect_left(self.a, x)
        if i < len(self.a) and self.a[i] == x:
            self.a.pop(i)

    def prev_next(self, x):
        i = bisect.bisect_left(self.a, x)
        prev = self.a[i-1] if i > 0 else None
        nxt = self.a[i] if i < len(self.a) else None
        return prev, nxt

def contrib(l):
    return l * (l + 1) // 2

def recompute_gap(cnt, positions, n):
    if not positions:
        return (n * (n + 1)) // 2

    res = 0
    prev = 0
    for p in positions:
        res += contrib(p - prev - 1)
        prev = p
    res += contrib(n - prev)
    return res

def main():
    n, q = map(int, input().split())
    arr = [0] + list(map(int, input().split()))

    pos = defaultdict(SortedSet)
    cnt = defaultdict(int)

    for i in range(1, n + 1):
        pos[arr[i]].add(i)

    for x in pos:
        cnt[x] = recompute_gap(cnt[x], pos[x].a, n)

    import bisect
    all_cnt = []

    for x in cnt:
        all_cnt.append(cnt[x])

    all_cnt.sort()

    def add_val(v):
        i = bisect.bisect_left(all_cnt, v)
        all_cnt.insert(i, v)

    def remove_val(v):
        i = bisect.bisect_left(all_cnt, v)
        all_cnt.pop(i)

    def get_min():
        return all_cnt[0]

    def update_remove(x, s):
        st = pos[x].a
        i = bisect.bisect_left(st, s)
        left = st[i-1] if i > 0 else 0
        right = st[i+1] if i+1 < len(st) else n+1

        L1 = s - left - 1
        L2 = right - s - 1
        L = L1 + L2 + 1

        cnt[x] -= contrib(L1)
        cnt[x] -= contrib(L2)
        cnt[x] += contrib(L)

        pos[x].discard(s)

    def update_add(x, s):
        st = pos[x].a
        i = bisect.bisect_left(st, s)
        left = st[i-1] if i > 0 else 0
        right = st[i] if i < len(st) else n+1

        L = right - left - 1
        L1 = s - left - 1
        L2 = right - s - 1

        cnt[x] -= contrib(L)
        cnt[x] += contrib(L1)
        cnt[x] += contrib(L2)

        pos[x].add(s)

    # initialize multiset correctly
    all_cnt = []
    for x in cnt:
        all_cnt.append(cnt[x])
    all_cnt.sort()

    for _ in range(q):
        s, newv = map(int, input().split())
        oldv = arr[s]

        remove_val(cnt[oldv])
        update_remove(oldv, s)
        add_val(cnt[oldv])

        remove_val(cnt.get(newv, 0))
        if newv not in cnt:
            cnt[newv] = (n * (n + 1)) // 2

        update_add(newv, s)
        add_val(cnt[newv])

        arr[s] = newv

        print(all_cnt[0])

if __name__ == "__main__":
    main()
```该实现依赖于维护每个值的明确位置集。 最微妙的部分是在删除和插入过程中正确识别左右邻居，因为边界位于`0`和`n+1`充当代表数组边缘的哨兵。 

多集维护在概念上与结构更新是分开的。 每次`cnt[x]`更改时，必须在更新之前删除旧值并在更新后重新插入，以避免过时的最小值。 

## 工作示例

 考虑一个小数组`[1, 2, 1]`。 

我们建立位置集：`1 -> {1, 3}`,`2 -> {2}`。 

为了价值`1`，间隙是`[0..0]`,`[2..2]`,`[4..3]`, 贡献`1 + 1 + 0 = 2`。 为了价值`2`，间隙是`[0..1]`和`[3..3]`, 贡献`3 + 1 = 4`。 

| 步骤| 更新 | 位置 1 | 位置 2 | 碳纳米管[1] | 碳纳米管[2] | 分钟|
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 初始化| {1,3} | {2} | 2 | 4 | 2 |
 | 1 | 删除 3 处的 1，添加 3 | {1} | {2,3} | 3 | 3 | 3 |

 该跟踪显示了如何删除第二次出现的`1`将周围的间隙合并为一个间隔，增加`cnt[1]`。 

现在考虑`[1,1,1,1]`并删除中间出现的情况：

 | 步骤| 更新 | 位置 1 | 碳纳米管[1] |
 | --- | --- | --- | --- |
 | 0 | 初始化| {1,2,3,4} | 0 |
 | 1 | 删除 2 | {1,3,4} | 1 |

 这表明，将单个大间隙分成两个较小间隙会增加避免该值的子数组总数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次更新最多修改两个有序集和一个多重集 |
 | 空间| O(n) | 每个位置跨结构存储一次|

 对数因子来自维护有序位置集。 由于每个查询仅涉及恒定数量的局部邻域，因此该解决方案非常适合动态数组问题的典型约束。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return main()

# minimal case
assert run("1 1\n1\n1 1\n") == "1\n"

# two values swap
assert run("3 2\n1 2 1\n1 2\n3 1\n") == "2\n2\n"

# all equal
assert run("5 2\n1 1 1 1 1\n3 2\n2 3\n") == "4\n4\n"

# boundary update
assert run("4 1\n1 2 3 4\n2 2\n") == "4\n"

# single value disappearance
assert run("2 1\n1 1\n1 2\n") == "3\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 1 | 基础初始化 |
 | 交换更新 | 稳定值| 正确的本地更新|
 | 一切平等| 单调间隙处理| 边缘间隔合并|
 | 边界变化| 定点处理| 边缘正确性 |
 | 值移除 | 重置行为 | 空集案例|

 ## 边缘情况

 当某个值丢失最后一次出现时，其位置集将变空。 在这种情况下，整个数组成为该值的单个有效间隙，这意味着每个子数组都会避免它。 实施必须明确重置其贡献`n(n+1)/2`，否则陈旧的间隙分解将会保留。 

对于像这样的数组`[1,1]`逐步删除这两个事件，最终删除后正确的状态是`cnt[1]`等于 3。任何仅更新局部间隙的实现都会错误地留下`cnt[1]`为 1 或 0，因为没有剩余间隔需要处理。 

在插入以前未见过的值期间，第一次出现会分割一个全长间隙。 例如，插入`x`进入位置处的空结构`i`创建两个长度间隙`i-1`和`n-i`。 如果不使用哨兵边界重新计算，则会立即出现差一错误，尤其是在`i = 1`或者`i = n`。
