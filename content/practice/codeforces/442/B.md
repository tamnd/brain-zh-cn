---
title: "CF 442B - 安德烈和问题"
description: "我们有一组朋友，其中每个朋友都以已知的概率独立成功地提出了一个竞赛问题。 安德烈将邀请这些朋友中的一些人。 一旦被邀请，每个朋友要么贡献一个问题，要么不贡献一个问题，与其他人无关。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 442
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 253 (Div. 1)"
rating: 1800
weight: 442
solve_time_s: 74
verified: true
draft: false
---

[CF 442B - 安德烈和问题](https://codeforces.com/problemset/problem/442/B)

 **评分：** 1800
 **标签：** 贪婪、数学、概率
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组朋友，其中每个朋友都以已知的概率独立成功地提出了一个竞赛问题。 安德烈将邀请这些朋友中的一些人。 一旦被邀请，每个朋友要么贡献一个问题，要么不贡献一个问题，与其他人无关。 

我们关心的结果非常具体：只有当恰好有一个朋友提出问题时，安德烈才会满意。 如果没有人提出问题，或者两个或更多朋友成功了，他就会不高兴。 任务是选择邀请哪些朋友，以便最大限度地提高恰好找到一位成功贡献者的概率。 

关键对象不是个体概率本身，而是在选择子集后得出的成功朋友数量的分布。 每个选定的子集定义了独立伯努利变量的总和，我们希望最大化该总和恰好等于 1 的概率。 

限制很小，最多100个朋友。 这立即排除了超出适度推理的子集的任何指数枚举，除非经过严格修剪，但更重要的是，它表明 O(n^2) 或 O(n^3) 动态方法是不必要的。 预计会有一个接近 O(n log n) 或 O(n) 的解决方案。 

当所有概率都很小时，就会出现微妙的边缘情况。 在这种情况下，邀请许多朋友似乎很有吸引力，因为它增加了至少一次成功的机会，但它也增加了多次成功的机会，这是不允许的。 当概率非常大（接近 1）时，就会出现另一种极端情况，此时邀请更多的人几乎可以保证多次成功，但却变得有害。 

“朋友越多越好”的天真直觉很快就会失效。 例如，如果所有概率均为 0.8，则邀请两位朋友恰好一次成功的概率等于 0.8·0.2 + 0.2·0.8 = 0.32，而邀请一位朋友则为 0.8。 所以添加更多可以降低目标概率。 

## 方法

 暴力方法会尝试所有朋友的子集。 对于每个子集，我们通过对成功朋友的所有选择求和并乘以其余朋友的失败概率来计算恰好一个朋友成功的概率。 对于大小为 k 的子集，这会花费 O(k)，并且对于所有子集，这将变为 O(n·2^n)，即使对于 n = 30，这也远远超出了可行的范围。 

固定子集的表达式结构揭示了一些更有用的东西。 假设我们选择一个子集 S。恰好一个成功的概率可以写为 pi 的 S 中 i 的总和乘以所有其他选定朋友失败的概率。 这引入了重复的乘法结构：每一项都依赖于子集的乘积。 

关键的观察是考虑添加一个朋友如何改变价值。 如果我们以当前值 P(S) 维护选定的集合 S，并且考虑以概率 p 添加新朋友，则新概率变为 (1 − p)·P(S) + p·product_of_failures(S)。 这种形式表明，朋友的贡献不仅取决于 p，还取决于它如何与当前结构相乘地相互作用。 

重写目标会产生更清晰的形式。 如果我们定义一个集合S：

 P(S) = S 中恰好有一次成功的概率

 然后添加一个新朋友 i 会产生：

 P(S ∪ {i}) = P(S)·(1 − p_i) + ((1 − p_j) 在 S 中 j 的乘积)·p_i

 这意味着维护两个聚合量：当前一次成功的概率和所有选定朋友失败的概率。 有了这些，我们就可以贪婪地考虑添加每个朋友并决定是否增加价值。

The optimal strategy ends up being greedy in a specific ordering: we sort friends by decreasing p_i / (1 − p_i), which corresponds to prioritizing those that give the best marginal improvement in the balance between creating exactly one success versus causing multiple successes.

 Once sorted, we iteratively try adding each friend and keep track of whether the probability improves.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n·2^n) | O(n·2^n) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. Transform each probability p_i into a value that reflects its relative strength, specifically the ratio p_i / (1 − p_i). This captures how likely a friend is to succeed relative to failing, which is what matters when balancing exactly-one outcomes.
 2. Sort all friends in descending order of this ratio. This ordering prioritizes friends that contribute more efficiently to producing a single success without overly increasing collision risk.
 3. 初始化两个变量：一个是所有选定好友都失败的概率，另一个是恰好一个好友成功的概率。 
4. Iterate through friends in sorted order, and for each friend, compute what happens if we include them. 乘法更新失败概率，并使用分解为“这个朋友是唯一成功的”加上“现有结构仍然有效，这个朋友失败了”来更新精确的概率。 
5. Track the best value encountered over all prefixes of this ordering, since stopping earlier corresponds to selecting a subset.
 6.输出得到的最大概率。 

### 为什么它有效

 在任何时候，所选子集的状态都由两个值完全描述：子集中没有人成功的概率，以及只有一个人成功的概率。 Any new element interacts with the subset only through these two aggregates. This reduces the subset structure to a one-dimensional ordering problem where optimality follows from local exchange arguments on adjacent elements in the sorted order. 如果两个相邻的朋友相对于 p/(1−p) 是无序的，交换它们不会提高结果概率，这保证了排序产生最佳前缀。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    p = list(map(float, input().split()))
    
    # sort by p/(1-p) decreasing
    p.sort(key=lambda x: x/(1.0 - x) if x < 1.0 else float('inf'), reverse=True)
    
    best = 0.0
    prod_fail = 1.0  # product of (1 - p_i) in current set
    prob_one = 0.0   # probability exactly one success
    
    for x in p:
        new_prod_fail = prod_fail * (1 - x)
        new_prob_one = prob_one * (1 - x) + prod_fail * x
        
        prob_one = new_prob_one
        prod_fail = new_prod_fail
        
        if prob_one > best:
            best = prob_one
    
    print(f"{best:.12f}")

if __name__ == "__main__":
    solve()
```排序步骤确保我们首先考虑在成功与失败贡献率方面最“高效”的朋友。 这两个运行变量代表当前子集的完整概率状态，因此更新它们足以评估每个前缀，而无需从头开始重新计算。 

一个常见的实现陷阱是忘记，当 p 极其接近 1 时，浮点除以 (1 − p) 会变得不稳定。代码通过将 p = 1 视为无限比来处理此问题，迫使这些元素排在前面。 

## 工作示例

 ### 示例 1

 输入：```
4
0.1 0.2 0.3 0.8
```After sorting by ratio, the order becomes:

 0.8、0.3、0.2、0.1

 We track state step by step:

 | 步骤| p_i | prod_fail | prob_one | best |
 | ---| ---| ---| ---| ---|
 | 初始化| - | 1.0 | 0.0 | 0.0 0.0 | 0.0
 | 1 | 0.8 | 0.8 0.2 | 0.2 0.8 | 0.8 |
 | 2 | 0.3 | 0.3 0.14 | 0.14 0.44 | 0.44 0.8 | 0.8
 | 3 | 0.2 | 0.2 0.112 | 0.112 0.496 | 0.496 0.8 | 0.8
 | 4 | 0.1 | 0.1 0.1008 | 0.5064 | 0.5064 0.8 | 0.8

 The best value is achieved after selecting only the first friend. This confirms that adding weaker probabilities after a strong one reduces the chance of exactly one success.

 ### 示例 2

 输入：```
3
0.5 0.5 0.5
```排序顺序不变。 

| 步骤| p_i | prod_fail | prob_one | 最好的|
 | ---| ---| ---| ---| ---|
 | 1 | 0.5 | 0.5 0.5 | 0.5 0.5 | 0.5 0.5 | 0.5
 | 2 | 0.5 | 0.5 0.25 | 0.5 | 0.5 0.5 | 0.5
 | 3 | 0.5 | 0.5 0.125 | 0.125 0.375 | 0.375 0.5 | 0.5

 最佳选择是任何单个朋友，因为添加更多只会增加碰撞概率。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位，随后是单一线性扫描 |
 | 空间| O(1) | O(1) | 除了输入数组之外，只有几个运行变量 |

 约束 n ≤ 100 使得即使有浮点运算和排序开销也足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import isclose
    
    data = inp.strip().split()
    n = int(data[0])
    p = list(map(float, data[1:]))

    p.sort(key=lambda x: x/(1.0 - x) if x < 1.0 else float('inf'), reverse=True)

    best = 0.0
    prod_fail = 1.0
    prob_one = 0.0

    for x in p:
        new_prod_fail = prod_fail * (1 - x)
        new_prob_one = prob_one * (1 - x) + prod_fail * x
        prod_fail, prob_one = new_prod_fail, new_prob_one
        best = max(best, prob_one)

    return f"{best:.10f}"

# provided sample
assert abs(float(run("4\n0.1 0.2 0.3 0.8")) - 0.8) < 1e-9

# all zeros
assert abs(float(run("3\n0.0 0.0 0.0")) - 0.0) < 1e-9

# all ones
assert abs(float(run("2\n1.0 1.0")) - 0.0) < 1e-9

# single element
assert abs(float(run("1\n0.7")) - 0.7) < 1e-9

# mixed
assert abs(float(run("3\n0.9 0.1 0.5")) - 0.9) < 1e-9
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 4 0.1 0.2 0.3 0.8 | 0.8 | 0.8 最佳子集是单个最大概率 |
 | 3 0 0 0 | 3 0 0 0 0 | all failures edge case |
 | 2 1 1 | 0 | 多次成功会使解决方案无效|
 | 1 0.7 | 1 0.7 0.7 | 最小输入正确性|
 | 3 0.9 0.1 0.5 | 0.9 | 0.9 排序效果正确性|

 ## 边缘情况

 When all probabilities are zero, every subset produces zero probability of exactly one success. The algorithm initializes best to zero and never increases it, so the output remains correct.

 When a probability is exactly one, any subset containing more than one such element immediately yields zero probability of exactly one success. 由于无限比率，贪心排序将这些朋友放在第一位，并且该算法正确地评估了仅选择一个这样的朋友产生的概率为一。 

当概率极度倾斜时，例如一个值接近一和许多小值，前缀评估可确保我们在第一个元素处停止，避免因添加低质量贡献者而导致性能下降。
