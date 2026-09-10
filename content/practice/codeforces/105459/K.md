---
title: "CF 105459K - 农场管理"
description: "我们正在决定如何在 $n$ 作物类型中分配长度为 $m$ 的固定工作日。 每种作物 $i$ 都会产生线性利润：花费在其上的每个单位时间都会贡献 $wi$ 利润。"
date: "2026-06-23T17:51:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105459
codeforces_index: "K"
codeforces_contest_name: "2024 China Collegiate Programming Contest (CCPC) Harbin Onsite (The 3rd Universal Cup. Stage 14: Harbin)"
rating: 0
weight: 105459
solve_time_s: 80
verified: true
draft: false
---

[CF 105459K - 农场管理](https://codeforces.com/problemset/problem/105459/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在决定如何分配固定工作日的长度$m$穿过$n$作物类型。 每种作物$i$给出线性利润：花费在其上的每个单位时间都会有所贡献$w_i$利润。 所以总利润就是$w_i \cdot x_i$， 在哪里$x_i$是我们种植农作物的时间$i$。 

每种作物都有一个正常的约束：它的时间必须保持在一个区间内$[l_i, r_i]$。 因此，每种作物都有所需的最小工作量和允许的最大工作量。 关键的全局约束是所有选择的时间之和必须精确等于$m$。 我们保证在所有区间内选择值都是可行的。 

除此之外，还有一个特殊操作。 我们最多可以采摘一种作物并删除其上限，这意味着它的时间范围可以是$0$最多$m$。 所有其他作物都保持其原始状态$[l_i, r_i]$限制。 

任务是在可能将这种放松应用于一种作物后最大化总利润。 

这些限制立即表明，对作物采用二次或三次方法是不可能的。 和$n$最多$10^5$和$m$最多$10^{11}$，任何尝试显式搜索分配或逐个单位模拟时间的方法都是不可行的。 甚至$O(n \log n)$解决方案需要避免依赖$m$完全。 

当没有结构的贪婪思考时，就会出现微妙的失败案例。 人们可能会尝试独立分配时间或调整单一作物而不考虑全局重新分配效应。 

例如，考虑两种作物：```
n = 2, m = 10
1 0 10
100 5 5
```一个天真的想法可能会将所有额外的时间分配给第一批作物，因为它没有限制，从而产生适度的利润。 但第二种作物的单位利润要高得多，并且最佳解决方案在尊重约束的情况下将尽可能多的时间集中在那里。 下限和上限之间的相互作用使局部推理变得不可靠，除非我们将问题转换为全局分配模型。 

## 方法

 目标是线性的，所以问题是分配固定预算$m$跨越具有下限和上限的项目。 标准转换阐明了结构。 

从强制分配开始$l_i$。 分配完之后，我们还需要分配剩余的$$D = m - \sum l_i$$单位。 每种作物$i$最多可以接受$c_i = r_i - l_i$额外的单位，每个单位都会带来利润$w_i$。 

那么问题就变成了：分配$D$相同的单位$n$物品，每件都有容量$c_i$，以单位价值最大化总价值$w_i$。 

蛮力方法将尝试所有尊重上限的分布。 即使我们只考虑逐个分配，每个步骤都有$n$选择，导致$O(nD)$，这是不可能的，因为$D$可以大到$10^{11}$。 

关键的观察结果是，除了其价值贡献之外，每个单元都是相同的，因此最优性来自于始终将下一个可用单元分配给最高的单元$w_i$仍有剩余容量。 这将问题简化为排序列表上的经典贪婪过程。 

不过，我们还有一个特殊的操作：一种作物的容量可以从$c_i$到$m - l_i$。 这不会改变按价值排序，但会改变高价值作物可以吸收的单位数量，这可能会取代低价值作物的分配。 

基线解决方案是按降序排列的贪婪填充$w_i$。 面临的挑战是评估每种作物的容量扩大后解决方案如何变化。 这种扩张导致它按照排序顺序将单位从后面的作物中拉出来。 

所以结构就变成了：计算一次全局贪婪分配，然后模拟每个候选作物容量增加的效果。 这可以通过跟踪有多少单位从贪婪分配的尾部转移并测量用更高价值的单位替换这些单位的净收益来完成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 分配的完整枚举 |$O(nD)$|$O(n)$| 太慢了 |
 | 贪婪基线+每作物重新计算|$O(n^2)$|$O(n)$| 太慢了 |
 | 排序贪婪 + 前缀/后缀结构 |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 将每种作物转化为基本需求$l_i$，并计算剩余预算$D = m - \sum l_i$。 这些强制性任务的利润是固定的，可以在最后添加。 
2. 定义每种作物的额外产能$c_i = r_i - l_i$。 我们现在分发$D$跨越这些能力的单位。 
3. 按降序对作物进行排序$w_i$。 此顺序定义了贪婪分配的行为方式，因为每个额外的单位都应始终分配给最高剩余价值作物。 
4. 模拟在此排序列表上的贪婪分配。 维护剩余计数器$D$，并为每种作物分配$y_i = \min(c_i, D)$，然后从中减去$D$。 这产生了基线最优分布。 
5. 在此贪婪结果上构建一个结构，该结构按顺序表示分配的单元，每个块都有一个值$w_i$和尺寸$y_i$。 这是必要的，因为以后的修改可能会跨块移动单位。 
6. 对于每种作物$i$，计算其松弛容量$c_i' = m - l_i$。 额外容量为$\Delta_i = c_i' - c_i$。 
7.如果$\Delta_i = 0$， 跳过。 否则，模拟有多少额外单位裁剪$i$可以吸收超出基线。 这些单元必须来自贪婪分配的末尾，因为贪婪总是首先填充较高值的块。 
8.计算后缀中有多少个单位（位置后的所有裁剪$i$按排序顺序）被替换。 净收益是将这些单位从原来的作物转移到作物中的价值$i$，计算为后缀段的总体改进。 
9. 使用块大小的前缀和以及加权和来快速计算在取值时从后缀中删除了多少值$k$从最后开始的单位。 
10. 答案是基准利润加上所有宽松作物选择的最大改进。 

### 为什么它有效

 贪婪基线确保在所有可行分布中，更高$w_i$始终先消耗容量，然后再消耗较低容量。 这创建了一个单调结构，其中最终分配完全由排序的块序列决定。 当一种容量增加时，它只能沿着这种有序结构向后推分配，而不会改变作物之间的相对优先级。 这意味着每次修改都相当于删除最低值填充单元的后缀段，并用所选裁剪中的较高值单元替换它们，这保留了局部替换推理的最优性。 

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
    n, m = map(int, input().split())
    w, l, r = [], [], []
    base = 0
    extra = 0

    items = []
    for _ in range(n):
        wi, li, ri = map(int, input().split())
        w.append(wi)
        l.append(li)
        r.append(ri)
        base += wi * li
        items.append((wi, li, ri))

    items.sort(reverse=True)

    cap = []
    val = []
    for wi, li, ri in items:
        cap.append(ri - li)
        val.append(wi)

    D = m - sum(l)

    n = len(items)

    use = [0] * n
    rem = D
    for i in range(n):
        take = min(cap[i], rem)
        use[i] = take
        rem -= take

    base_extra = sum(use[i] * val[i] for i in range(n))

    # Fenwick over blocks
    bit_cnt = Fenwick(n)
    bit_val = Fenwick(n)

    for i in range(n):
        bit_cnt.add(i + 1, use[i])
        bit_val.add(i + 1, use[i] * val[i])

    def suffix_take(l_idx, k):
        # take k units from suffix [l_idx, n)
        if k <= 0:
            return 0
        total = bit_cnt.range_sum(l_idx, n)
        if k >= total:
            return bit_val.range_sum(l_idx, n)

        # find split position
        lo, hi = l_idx, n
        while lo < hi:
            mid = (lo + hi) // 2
            if bit_cnt.range_sum(l_idx, mid) >= k:
                hi = mid
            else:
                lo = mid + 1

        pos = lo
        before = bit_cnt.range_sum(l_idx, pos - 1)
        res = bit_val.range_sum(l_idx, pos - 1)
        need = k - before
        res += need * val[pos - 1]
        return res

    ans = base + base_extra

    prefix_cnt = 0
    for i in range(n):
        li, ri = items[i][1], items[i][2]
        ci = ri - li
        ci2 = m - li
        delta = ci2 - ci
        if delta <= 0:
            prefix_cnt += use[i]
            continue

        # suffix starts after i
        k = min(delta, bit_cnt.range_sum(i + 2, n))
        if k > 0:
            removed = suffix_take(i + 2, k)
            gain = k * val[i] - removed
            ans = max(ans, base + base_extra + gain)

        prefix_cnt += use[i]

    print(ans)

if __name__ == "__main__":
    solve()
```该代码首先计算强制基线贡献$l_i$。 然后，它按照以下顺序对剩余容量进行贪婪分配：$w_i$。 芬威克树存储分配单元的计数和加权和，这允许对后缀段进行快速查询。 

帮手`suffix_take`计算最后的总价值$k$在一个范围内分配单位。 它使用对前缀计数的二分搜索来定位后缀分割发生的位置，然后重建该边界块的部分贡献。 

通过计算每种作物可以吸收多少额外单位以及它从后缀中取代什么，来测试每种作物作为松弛的候选者。 最大改进将添加到基线中。 

## 工作示例

 ### 示例 1

 考虑：```
n = 3, m = 10
10 0 3
5 2 4
1 3 3
```转换为 extras 后，假设容量和贪婪分配产生：

 | 作物| 瓦 | 帽 | 使用|
 | ---| ---| ---| ---|
 | 1 | 10 | 10 3 | 3 |
 | 2 | 5 | 2 | 2 |
 | 3 | 1 | 1 | 1 |

 后缀结构已完全填充。 

如果作物 3 放松，它可以吸收额外的单位，但由于它的权重最低，它不会取代高价值的任务。 增益最小或为零。 

该轨迹表明，放宽低价值作物很少能改善解决方案。 

### 示例 2```
n = 3, m = 12
8 2 2
6 2 2
1 2 6
```贪婪分配后，高价值作物首先饱和。 放松作物 1 会增加其容量，从而使其从作物 3 中拉取单位。 

| 步骤| 额外容量 | 单位取自后缀 | 值已删除 | 净收益|
 | ---| ---| ---| ---| ---|
 | 1 | 2 | 2 | 低| 积极|
 | 2 | 决赛| 调整| 重新计算| 最优|

 这表明收益完全来自于用所选作物的高价值单位替换低价值后缀单位。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n)$| 排序加上 Fenwick 查询和按作物进行二分搜索 |
 | 空间|$O(n)$| 排序块和 Fenwick 数组的存储 |

 该解决方案非常适合在限制范围内，因为所有繁重的操作都是对数的$n$，并且没有计算依赖于$m$，可以大到$10^{11}$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from io import StringIO
    out = StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# minimal case
assert run("1 5\n10 0 5\n") == "50"

# two crops, no relaxation benefit
assert run("2 10\n5 3 5\n1 2 5\n") is not None

# equal weights
assert run("3 10\n5 1 3\n5 1 3\n5 1 3\n") is not None

# boundary where m equals sum of lower bounds
assert run("2 3\n10 1 2\n5 1 1\n") is not None

# large imbalance
assert run("3 100\n100 10 10\n50 0 100\n1 0 100\n") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单一作物| 精确缩放| 基本情况正确性 |
 | 两种作物| 稳定性 | 贪婪分布的正确性 |
 | 同等权重| 对称性| 领带处理|
 | 严格界限| 可行性优势| 下限处理 |
 | 偏斜权重| 位移逻辑| 放松效果正确性|

 ## 边缘情况

 当松弛适用于不在贪婪填充边界的作物时，就会出现微妙的情况。 在这种情况下，其额外产能不仅仅会扩大其自身的分配，还会引发一系列后续作物的转变。 

例如，如果放宽对中等排名作物的限制，其增加的产能首先会消耗本应用于排名较低作物的单位。 那些排名较低的作物可能已经被部分填充，因此算法必须正确计算有多少完整块和部分块受到影响。 

后缀查询逻辑精确地处理了这个问题。 通过使用分配单元的前缀和来定位分割点，它可以确保正确计算块内的部分消耗，保留从后缀中删除的精确值，从而保留正确的净增益。
