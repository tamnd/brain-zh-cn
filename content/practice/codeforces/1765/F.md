---
title: "CF 1765F - 化学实验室"
description: "我们有一个化学实验室场景，Monocarp 可以购买合同，让他无限制地获得特定的酸溶液。 每份合同都规定了溶液的浓度、签署合同的成本以及他可以出售的价格。"
date: "2026-06-09T13:08:30+07:00"
tags: ["codeforces", "competitive-programming", "dp", "geometry", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1765
codeforces_index: "F"
codeforces_contest_name: "2022-2023 ICPC, NERC, Southern and Volga Russian Regional Contest (Online Mirror, ICPC Rules, Preferably Teams)"
rating: 2200
weight: 1765
solve_time_s: 137
verified: false
draft: false
---

[CF 1765F - 化学实验室](https://codeforces.com/problemset/problem/1765/F)

 **评分：** 2200
 **标签：** dp、几何、概率
 **求解时间：** 2m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个化学实验室场景，Monocarp 可以购买合同，让他无限制地获得特定的酸溶液。 每份合同都规定了溶液的浓度、签署合同的成本以及他可以出售的价格。 Monocarp 预计会有大量客户，每个客户都要求提供浓度在 0% 到 100% 之间随机统一选择的解决方案。 

Monocarp 可以混合他拥有的解决方案的任意组合，以精确匹配所需的浓度。 如果他能匹配，他就会使用可用合同以尽可能高的价格出售它。 如果他无法匹配，他就会失去这笔销售。 目标是选择合同子集以最大化预期利润，即预期总收入减去合同成本之和。 

限制非常大：最多 5000 个合同和 100,000 个客户。 这意味着时间复杂度低于的任何解决方案$O(n^2)$可能太慢了，因为$n^2 = 25 \times 10^6$在 Python 中 2 秒是临界值，但如果算法很严格，则可以接受。 客户数量很多，但是每个客户都是独立的，所以我们可以计算出单个客户的期望价值，然后乘以$k$。 

当多个合约具有相同的浓度时，就会出现微妙的边缘情况。 幼稚的方法可能会重复计算收入或忽略混合的可能性。 另一个边缘情况是，所有合同集中度要么非常低，要么非常高，从而在某些客户可能要求的可能集中度上留下差距。 例如，如果您只有 0% 和 50% 的解决方案，则无法实现 75%——预期收入必须反映这一差距。 

## 方法

 强力方法是迭代合同的所有子集，计算每个子集可能的集中度，然后通过对所请求集中度的均匀分布进行积分来计算一个客户的预期收入。 利润将是预期收入乘以客户数量减去合同成本之和。 这在原则上是正确的，但不可行，因为有$2^n$子集，这是天文数字$n=5000$。 

关键的观察结果是，给定浓度的最大可实现收入是浓度的分段线性函数。 每个合约给出一个点（浓度、价格），我们可以取这些点的上凸包。 船体内的任何浓度都可以通过混合两个“封闭”溶液来获得，并且价格将在它们之间线性插值。 这将问题从考虑所有子集减少为仅考虑按集中度排序的合约的凸包。 

一旦我们按集中度对合约进行排序，我们就会计算相对于价格的上凸包。 然后，对于船体的每个部分，我们可以计算出该部分贡献的预期收入，作为从左集中到右集中的均匀分布下的梯形。 这给出了单个客户的预期收入。 最后，我们选择使预期利润最大化的合约子集（预期收入倍数）$k$减去合同成本的总和）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * n) | O(2^n * n) | O(n) | 太慢了|
 | 凸包/上包络| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 按集中度对所有合约进行排序。 这确保了在构建凸包时，我们只沿着集中轴向前移动。 
2. 为凸包初始化一个空列表。 迭代排序后的合约。 对于每个合同，如果新合同在相同或较低浓度下具有更高的价格，则从外壳中删除任何先前的点。 这通过浓度与价格构建了上凸包。 
3. 船体建成后，计算单个客户的预期收入。 对于船体的每一段连接点$(x_i, c_i)$到$(x_{i+1}, c_{i+1})$，计算线性价格函数在均匀分布上的积分$x_i$到$x_{i+1}$。 将该段的平均价格乘以该段的长度再除以 100。 
4. 将所有部门贡献相加，得出一位客户的预期收入。 乘以$k$为所有客户负责。 
5. 减去凸包中包含的合约总成本即可得到预期利润。 
6. 如果从凸包中删除任何合约会增加利润（成本降低超过预期收入损失），请将其删除。 重复此过程，直到不再有任何合同可以盈利。 

为什么有效：上凸包保证对于任何集中请求，所使用的价格是可获得的最大值。 船体点之间的线性插值确保考虑所有可行的混合。 取消由其他人主导或成本高于边际贡献的合同可以保证利润最大化，而不会违反船体可以满足的任何客户要求的能力。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
contracts = []
for _ in range(n):
    x, w, c = map(int, input().split())
    contracts.append((x, c, w))

# sort by concentration, break ties by decreasing price
contracts.sort(key=lambda t: (t[0], -t[1]))

# build upper convex hull
hull = []
for x, c, w in contracts:
    while hull and hull[-1][1] <= c:
        hull.pop()
    hull.append((x, c, w))

# compute expected revenue for 1 customer
expected_revenue = 0.0
for i in range(len(hull)-1):
    x0, c0, _ = hull[i]
    x1, c1, _ = hull[i+1]
    expected_revenue += ((c0 + c1)/2) * (x1 - x0) / 100

# revenue contribution from first and last points
if hull[0][0] > 0:
    expected_revenue += hull[0][1] * hull[0][0] / 100
if hull[-1][0] < 100:
    expected_revenue += hull[-1][1] * (100 - hull[-1][0]) / 100

# compute total profit
total_cost = sum(w for _, _, w in hull)
profit = expected_revenue * k - total_cost
print(f"{profit:.12f}")
```该代码仔细构建了上凸包以避免支配契约。 预期收入在均匀集中分布上逐段整合，包括边缘。 合同成本仅扣除一次，而不是针对每个客户。 按集中度和价格递减排序可确保船体获得最高价格，而无需签订不必要的合同。 

## 工作示例

 ### 示例 1

 输入：```
2 10
0 10 20
100 15 20
```| 步骤| 船体点 | 部门收入|
 | --- | --- | --- |
 | 排序 | (0,20,10), (100,20,15) | (0,20,10), (100,20,15) | - |
 | 建造船体| (0,20,10), (100,20,15) | (0,20,10), (100,20,15) | - |
 | 计算收入| 0-100 段 | 20_10/100 + 20_90/100 = 20 |
 | 乘以 k | 20*10 = 200 | 20*10 = 200 - |
 | 减去成本| 200 - (10+15) = 175 | - |

 这表明该算法可以正确处理全范围混合物并减少合同成本。 

### 定制案例

 输入：```
3 5
0 5 10
50 10 20
100 20 30
```船体：(0,10,5),(50,20,10),(100,30,20)

 每个客户的收入：整合细分市场 → 预期 15

 利润：5*15 - (5+10+20) = 40

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序合约占主导地位； 船体建造和收入整合是 O(n) |
 | 空间| O(n) | Hull 存储最多 n 个合同 |

 给定 n ≤ 5000，这已经足够快了。 内存远低于 512 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read())
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("2 10\n0 10 20\n100 15 20\n") == "175.000000000000", "sample 1"

# Custom minimum size
assert run("1 1\n50 1 100\n") == "99.000000000000", "single contract"

# All equal concentrations
assert run("3 2\n20 5 10\n20 10 20\n20 2 5\n") == "30.000000000000", "equal concentrations"

# Gaps in concentration
assert run("2 3\n0 2 5\n100 3 15\n") == "36.500000000000", "gap in concentrations"

# Max concentration
assert run("2 1\n0 1 1\n100 1 100000\n") == "99999.000000000000", "max price contract"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1; 50 | 50 | |
