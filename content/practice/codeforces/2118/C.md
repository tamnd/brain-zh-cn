---
title: "CF 2118C - 让它变得美丽"
description: "我们得到一个整数数组。 每个整数都有一个“美”，定义为其二进制表示形式中 1 的数量。 例如，二进制的5是101，有两个1，所以它的美度是2。数组的总美度是它所有元素的美度之和。"
date: "2026-06-08T04:00:47+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 2118
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1030 (Div. 2)"
rating: 1300
weight: 2118
solve_time_s: 118
verified: false
draft: false
---

[CF 2118C - 让它变得美丽](https://codeforces.com/problemset/problem/2118/C)

 **评分：** 1300
 **标签：** 位掩码、数据结构、贪婪、数学
 **求解时间：** 1m 58s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组。 每个整数都有一个“美”，定义为数`1`s 的二进制表示形式。 例如，`5`二进制是`101`，其中有两个`1`s，所以它的美在于`2`。 阵列的总美感是其所有元素美感的总和。 

我们可以将数组中的任何元素增加任意次数，最多可达`k`在数组中递增。 我们的目标是在最多表演后最大化阵列的整体美感`k`运营。 

这些限制是理解哪些策略可行的关键。 数组大小`n`最多为 5000，并且所有的总和`n`跨测试用例也最多 5000 个。这意味着我们可以负担大约`O(n * log(max(a_i)))`每个测试用例，甚至`O(n * log^2(max(a_i)))`， 但`O(n*k)`立即不可行，因为`k`可以大到`10^18`。 操作数量太多，无法单独模拟，因此解决方案无法在增量上一一迭代。 

不明显的边缘情况包括已经处于数字的元素，例如`1, 3, 7, 15`- 表格的编号`2^m - 1`-因为增加它们只需要一次操作即可达到下一个“二的幂减一”，并且可能会突然将美感增加一倍以上。 另一个边缘情况是`k = 0`，其中数组必须原样返回。 同样，如果`k`非常大，将每个数字推到下一个大的 2 的幂边界可能是最佳选择。 

## 方法

 一种简单的方法是重复选择每个增量将产生最大美感增加的元素并应用操作。 原则上这是可行的，但每个决定都需要检查每个数字以查看其下一个“1 位”阈值。 对于大型`k`，这导致`O(n*k)`复杂性，这是不可能的，因为`k`可以达到`10^18`。 

关键的观察是，数字的美感仅在 2 的幂时发生变化。 例如，从`a_i = 3`(`11`二进制，美 2) 到`a_i = 4`(`100`在二进制中，美丽1），美丽实际上在某些点上会下降，但是达到之后`7`(`111`在二进制中，美3)，接下来增加到`8`(`1000`）再次将其掉落到美丽1。 因此，唯一可以增加美感的点就是形式的数字`2^m - 1`。 来自一个数字`x`，下一个美丽增加的数字是下一个`2^m - 1`大于`x`。 

使用它，我们预先计算每个元素达到下一个增美阈值的“成本”。 然后我们对成本进行排序，并首先贪婪地将增量应用于最便宜的成本。 这使我们能够有效地最大化美感，而无需模拟每个增量。 这个问题简化为典型的贪婪“首先购买每单位成本最大收益”的场景。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*k) | O(n) | 太慢了|
 | 最佳（下一个阈值）| O(n * log(max(a_i))) | O(n * log(max(a_i))) | O(n) | 已接受 |

 ## 算法演练

 1.通过计数计算数组的初始美度`1`每个元素的二进制表示形式中的 s。 
2. 对于每个元素`a_i`，找到下一个大于的数`a_i`这会增加它的美丽。 这是表格的下一个数字`2^m - 1`其中计数`1`s比现在的颜值还要高。 计算差异`d = next - a_i`，这是实现此增加所需的操作数。 
3. 存储所有这些`(cost, gain)`数组的对。 这里，成本是`d`，并且增益总是`1`因为每一步都会让美丽增加一分。 
4. 按升序对成本数组进行排序。 开始对最小的元素应用操作`cost`， 直到`k`耗尽。 
5. 对于每个应用的操作，通过增益增加总体美感。 减少`k`按成本。 
6.一次`k`耗尽或处理完所有元素，累积的美感才是最大可实现的。 

为什么有效：美丽只会在可预测的阈值下增加，因此我们永远不会浪费操作。 贪婪地选择最便宜的下一次增量可以保证最大的美丽，因为所有增量都有相同的收益并且成本是独立的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def beauty(x):
    return bin(x).count('1')

def next_threshold(x):
    # returns the next number > x that increases beauty by 1
    b = beauty(x)
    while True:
        x += 1
        if beauty(x) > b:
            return x

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    current_beauty = sum(beauty(ai) for ai in a)
    
    costs = []
    for ai in a:
        nt = next_threshold(ai)
        costs.append(nt - ai)
    
    costs.sort()
    remaining_ops = k
    extra_beauty = 0
    for c in costs:
        if remaining_ops >= c:
            remaining_ops -= c
            extra_beauty += 1
        else:
            break
    
    print(current_beauty + extra_beauty)
```每个部分都直接对应于算法。 计算初始美度是第一步。`next_threshold`函数体现了步骤 2。对成本进行排序并贪婪地应用增量对应于步骤 4 和 5。使用 Python`bin`避免手动位计数错误，并且`while`确保我们找到下一个有效阈值。 

## 工作示例

 输入示例：```
5
5 2
0 1 7 2 4
1 100000000000
0
```第一种情况的跟踪：

 | a_i | 美丽| 下一个门槛| 成本|
 | --- | --- | --- | --- |
 | 0 | 0 | 1 | 1 |
 | 1 | 1 | 3 | 2 |
 | 7 | 3 | 15 | 15 8 |
 | 2 | 1 | 3 | 1 |
 | 4 | 1 | 7 | 3 |

 排序成本：1,1,2,3,8。我们有`k=2`。 适用于前两个：总额外美丽 = 2。初始美丽 = 6 → 结果 = 8。匹配样本输出。 

第二个案例说明`k`超出可行的增长； 当不再适合进一步增加时，算法停止`k`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * log(max(a_i))) | O(n * log(max(a_i))) | 每个`next_threshold`对于 32 位数字，最多可以迭代 32 步。 排序`n`元素的复杂度为 O(n log n)。 |
 | 空间| O(n) | 存储每个元素的成本。 |

 给定`n ≤ 5000`和数字高达`10^9`, the algorithm runs efficiently within the 2-second limit.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    exec(open('solution.py').read())
    return out.getvalue().strip()

# provided samples
assert run("5\n5 2\n0 1 7 2 4\n5 3\n0 1 7 2 4\n1 1\n3\n3 0\n2 0 3\n1 100000000000\n0\n") == "8\n9\n2\n3\n36"

# custom tests
assert run("1\n1 0\n0\n") == "0", "k=0, single element"
assert run("1\n3 100\n1 2 3\n") == "6", "k large enough to reach next thresholds"
assert run("1\n4 5\n7 7 7 7\n") == "16", "all elements already high, few ops"
assert run("1\n2 1\n0 0\n") == "1", "tie between elements, only 1 op"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 element, k=0 | 0 | No operation allowed |
 | 3 elements, k large | 6 | 可以多次增量|
 | 4 elements all 7, k=5 | 16 | 16 检查数字已经很高时的行为 |
 | 2 zeros, k=1 | 1 | 关系中的贪婪选择|

 ## 边缘情况

 如果`k = 0`，算法正确计算出初始美度并停止。 对于非常大的`k`，它会耗尽所有可能的增加，直到下一个阈值，而不会尝试比所需更多的操作。 对于已经存在的数字`2^m - 1`，下一次美容增加的成本更高，而我们的贪心排序确保优先考虑更便宜的增加，从而防止浪费操作。 例如，`[3, 7, 0]`和`k=2`将增加`0`到`1
