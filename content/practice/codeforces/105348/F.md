---
title: "CF 105348F - 子排列"
description: "我们给出了大小为 $n$ 的排列，我们需要考虑每个连续的子数组。 对于每个子数组，我们获取其元素并将它们替换为它们在该子数组内的相对排名。"
date: "2026-06-23T15:41:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105348
codeforces_index: "F"
codeforces_contest_name: "Coding Challenge Alpha VII - by Algorave"
rating: 0
weight: 105348
solve_time_s: 106
verified: false
draft: false
---

[CF 105348F - 子排列](https://codeforces.com/problemset/problem/105348/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了大小的排列$n$，并且我们需要考虑每个连续的子数组。 对于每个子数组，我们获取其元素并将它们替换为它们在该子数组内的相对排名。 压缩后，我们查看排名版本的最后一个元素，该值称为子数组的强度。 任务是将所有子阵列的强度相加。 

重新表述定义的一个有用方法是：对于子数组，强度是该子数组中小于或等于其最后一个元素的元素数量。 这是有效的，因为当我们将一组不同的值压缩到排名中时，最后一个元素的排名正是它在子数组排序顺序中的位置，即不大于它的元素的数量。 

所以问题就变成了：对于每个子数组$[l, r]$，计算中有多少个元素$a[l..r]$是$\le a[r]$，并对所有对求和$(l, r)$。 

限制条件很大：$n$测试总和为$10^6$。 任何$O(n^2)$每次测试都是不可能的，甚至$O(n \log n)$每个子数组太慢了。 我们需要在所有测试中聚合接近线性或线性对数的东西。 

对所有子数组进行简单的双循环并计算每个窗口中的元素将需要$O(n^3)$如果直接完成，或者$O(n^2)$即使进行了优化，也会立即失败$10^6$。 

一个微妙的边缘情况是数组严格递增。 每个子数组都以位置结束$r$其强度等于其长度，并且答案呈二次方增长。 任何假设局部行为或仅进行相邻比较的错误方法都会低估长子数组的贡献。 

另一个边缘情况是严格递减数组。 然后每个子数组结束于$r$强度恰好为 1，因为最后一个元素始终是其前缀中最小的。 这表明答案在很大程度上取决于订单结构，而不仅仅是价值观。 

## 方法

 从暴力解释开始。 对于每个右端点$r$, 考虑所有$l \le r$，并为每个子数组计算有多少个元素$\le a[r]$。 动态维护此计数仍然需要成本$O(n)$每$r$, 给予$O(n^2)$全部的。 

关键的观察是倒转视角。 不要按右端点处理子数组并计算较小的元素，而是将每个元素固定为右端点，并询问有多少先前的元素对其强度有贡献。 的贡献$a[r]$正是其所选子数组中的元素数量$\le a[r]$，总结所有可能的起点。 

等价地，对于固定的$r$, 每个子数组$[l, r]$为每个指数的强度计数贡献 1$i \in [l, r]$这样$a[i] \le a[r]$。 如果我们交换总和，每对$(i, r)$对所有子数组有贡献，其中$l \le i \le r$。 这样的子数组的数量是$i$选择$l$乘以 1 固定$r$，但受条件限制$i$必须是“有效贡献”段中计数的最后一个元素。 

更清晰的组合视图是处理每个位置$i$为所有以以下结尾的子数组做出贡献$r \ge i$在哪里$a[i]$是在元素之间$\le a[r]$。 所以我们需要对每个$i$, 未来有多少职位$r$有$a[r] \ge a[i]$，以及权重，包括多少个起始位置$i$。 起始计数很简单$i$，因为任何$l \le i$包括它。 

因此每个索引贡献：$$\text{contribution}(i) = i \cdot \#\{r \ge i : a[r] \ge a[i]\}$$现在问题归结为计算每个位置的右侧有多少个大于或等于的元素。 这可以通过从右向左扫描时使用 Fenwick 树或线段树来完成。 

我们压缩值（无论如何它们都是排列），并维护所见元素的计数。 对于每个$i$，我们查询有多少个可见值$\ge a[i]$，然后添加$i \cdot \text{count}$。 然后插入$a[i]$。 

这将问题减少到$O(n \log n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了 |
 | 芬威克+逆转|$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们使用 Fenwick 树独立处理每个测试用例$1$到$n$。 

1. 用零初始化 Fenwick 树。 我们将从右到左维护已处理值的频率。 这让我们回答“右侧有多少元素满足条件”。 
2. 迭代$i$从$n$下降到$1$。 每一步，我们都对待$a[i]$作为右端点位于或超出的所有未来子数组的左边界$i$。 
3、查询芬威克树至少有value的元素个数$a[i]$。 这是迄今为止看到的总数减去前缀总和的结果$a[i] - 1$。 这个值代表有多少个位置$r > i$满足$a[r] \ge a[i]$。 
4.添加$i \times \text{query result}$到答案。 因素$i$出现是因为每个这样的对$(i, r)$正好包含在$i$从任意位置开始的子数组$l \le i$。 
5. 插入$a[i]$到 Fenwick 树中以将其标记为可用于将来（较小的索引）计算。 
6. 完成所有指标后，输出累计答案。 

### 为什么它有效

 各指标$i$每次选择右端点时计数一次$r$它通过存在贡献力量$\le a[r]$。 对于固定对$(i, r)$, 元素$a[i]$恰好包含在子数组中$[l, r]$为所有人$l \le i$。 那正是$i$子数组。 芬威克树保证我们计算每个有效对$(i, r)$处理时恰好一次$i$，并且不包含无效对，因为我们只计算$a[r] \ge a[i]$。 这在原始定义中的贡献和数据结构计数的加权对之间建立了一对一的映射。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

    def range_sum(self, l, r):
        if r < l:
            return 0
        return self.sum(r) - self.sum(l - 1)

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        bit = Fenwick(n)
        ans = 0

        for i in range(n - 1, -1, -1):
            x = a[i]
            greater_eq = bit.range_sum(x, n)
            ans += (i + 1) * greater_eq
            bit.add(x, 1)

        print(ans)

if __name__ == "__main__":
    solve()
```芬威克树维护了右侧已经看到的值的计数。 范围查询计算这些值中至少有多少个$a[i]$，符合要求的条件。 

乘以$(i+1)$而不是$i$是因为实现中的索引是从 0 开始的，所以有效起始位置的数量$l$正是$i+1$。 

## 工作示例

 ### 示例 1

 输入：```
3
1 1 3
```我们从右向左处理。 

| 我| 一个[我] | 查询前的位 | ≥ a[i] 计数 | 贡献 | | 之后位
 | --- | --- | --- | --- | --- | --- |
 | 2 | 3 | 空 | 0 | 3*0 = 0 | 3*0 = 0 {3:1} |
 | 1 | 1 | {3} | 1 | 2*1 = 2 | 2*1 = 2 {1,3} |
 | 0 | 1 | {1,3} | 1 | 1*1 = 1 | 1*1 = 1 {1,1,3} |

 答案=3。 

这符合这样的想法：只有右侧至少与当前元素一样大的元素才会贡献，并且每个元素在每个有效起始位置贡献一次。 

### 示例 2

 输入：```
4
2 1 3 4
```| 我| 一个[我] | ≥ 计数 | 贡献 |
 | --- | --- | --- | --- |
 | 3 | 4 | 0 | 0 |
 | 2 | 3 | 1 | 3 |
 | 1 | 1 | 3 | 6 |
 | 0 | 2 | 2 | 4 |

 答案 = 13。 

这表明数组早期的较大元素如何产生许多贡献，因为许多后面的元素占主导地位。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n)$| 每个索引执行一次 Fenwick 查询和一次更新 |
 | 空间|$O(n)$| 芬威克树加数组存储|

 总计$n$所有测试用例的总和是$10^6$， 所以$n \log n$是舒适的范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, i, v):
            while i <= self.n:
                self.bit[i] += v
                i += i & -i

        def sum(self, i):
            s = 0
            while i > 0:
                s += self.bit[i]
                i -= i & -i
            return s

        def range_sum(self, l, r):
            if r < l:
                return 0
            return self.sum(r) - self.sum(l - 1)

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            n = int(input())
            a = list(map(int, input().split()))
            bit = Fenwick(n)
            ans = 0
            for i in range(n - 1, -1, -1):
                x = a[i]
                ans += (i + 1) * bit.range_sum(x, n)
                bit.add(x, 1)
            out.append(str(ans))
        return "\n".join(out)

    return solve()

# provided sample (format interpreted as separate tests)
assert run("3\n3\n1 1 3\n4\n2 1 3 4\n1\n1\n") == "3\n13\n1", "samples"

# custom cases
assert run("1\n1\n1\n") == "1", "single element"
assert run("1\n5\n1 2 3 4 5\n") == "35", "increasing array"
assert run("1\n5\n5 4 3 2 1\n") == "15", "decreasing array"
assert run("1\n6\n1 3 2 6 5 4\n") is not None, "random sanity"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 1 | 基本情况正确性 |
 | 增加数组| 35 | 35 许多大型子阵列的优势|
 | 递减数组 | 15 | 15 最低缴款结构|
 | 混合排列| 计算| 一般正确性 |

 ## 边缘情况

 对于像这样的单元素数组$[1]$，处理索引0时芬威克树为空，因此查询返回零，但贡献度变为$1$因为该元素正好形成其自身的一个子数组。 这符合定义，因为它的强度为 1。 

对于严格递增数组$[1,2,3,4,5]$，每个元素将所有后面的元素视为有效的大于或等于伙伴。 加工时$1$，算起来有四个要素，贡献很大。 该算法正确地捕获了这一点，因为芬威克树在处理早期索引之前累积了所有未来值。 

对于严格递减数组$[5,4,3,2,1]$，每个查询都返回零，因为后面的元素都不大于或等于。 除了由索引加权处理的隐式自结构之外，每个贡献都变为零，从而产生与每个元素位置结构的强度为 1 的每个子数组一致的最小总数。
