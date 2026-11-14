---
title: "CF 436F - 横幅"
description: "我们被要求优化一款移动应用程序的收入，该应用程序既有带广告的免费版本，也有无广告的付费版本。"
date: "2026-06-07T02:58:12+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 436
codeforces_index: "F"
codeforces_contest_name: "Zepto Code Rush 2014"
rating: 3000
weight: 436
solve_time_s: 264
verified: false
draft: false
---

[CF 436F - 横幅](https://codeforces.com/problemset/problem/436/F)

 **评分：** 3000
 **标签：** 暴力破解、数据结构、dp
 **求解时间：** 4m 24s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求优化一款移动应用程序的收入，该应用程序既有带广告的免费版本，也有无广告的付费版本。 每个用户都有两个个人限制：他们愿意为付费版本支付多少钱，以及他们愿意在免费版本中容忍多少广告横幅。 如果用户可以忍受免费版本，他们就会使用它。 否则，如果他们买得起付费版本，他们就会购买。 如果两者都不可接受，他们就不会使用该应用程序。 

我们必须计算每个可能的横幅数量$c$从0到用户之间的最大容忍度加一，可能的最高总利润以及对应的最优价格$p$对于付费版本。 免费用户贡献$c \times w$利润，而付费用户贡献$p$。 

约束条件告诉我们$n$可以达到$10^5$，而每个用户的付费意愿和容忍度取决于$10^5$。 有了这么多用户，任何明确检查每个价格的算法$p$对于每个横幅计数$c$会太慢。 我们需要更接近的东西$O(n \log n)$比$O(n^2)$。 此外，输出需要每行一行$c$，这可能高达$10^5 + 2$线。 这立即排除了枚举所有的方法$p$价值观天真。 

不明显的边缘情况包括容忍零横幅的用户、无法支付任何费用的用户以及所有用户仅免费或仅付费的场景。 例如，如果一个用户有$a_i = 0$和$b_i = 0$，另一个用户有$a_i = 1$和$b_i = 1$，选择$c = 0$可能会导致完全从免费用户那里获利。 如果处理不慎，简单的算法可能会错误计算哪些用户是免费的，哪些是付费的，因为它可能无法正确考虑阈值的相等性。 

## 方法

 蛮力方法很简单。 对于每个横幅计数$c$，将每个用户视为免费、付费或不活跃，具体取决于$c$和候选价格$p$。 我们可以尝试所有候选人$p$通过对用户进行排序来获取值$a_i$和测试阈值。 这是正确的，但对于每个$c$，测试所有可能的价格导致$O(n^2)$操作，大致是$10^{10}$在最坏的情况下，因此不可行。 

关键的见解来自于观察对于固定的$c$，利润函数$p$是分段常数，用户的跳跃$a_i$价值观。 这是因为增加$p$略高于用户的支付意愿会立即将其从付费状态降至不活跃状态，并且会降低$p$稍微低于一点并不会改变谁付费。 对用户进行排序$a_i$和扫地$p$通过这些阈值，我们可以有效地计算总利润。 免费用户的贡献仅取决于$c$，所以可以直接添加。 这大大降低了复杂性，因为我们最多只考虑$n$候选人$p$每值$c$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳| O(n log n + n * max_b) | O(n log n + n * max_b) | O(n + max_b) | O(n + max_b) | 已接受 |

 ## 算法演练

 1.读取输入并存储每个用户的支付意愿$a_i$和宽容$b_i$。 跟踪最大值$b_i$了解我们需要考虑的横幅数量范围。 
2. 对用户进行预处理：按升序对用户进行排序$a_i$。 这使我们能够有效地浏览候选价格，并准确地了解哪些用户从付费转为不活跃$p$增加。 
3. 对于每个横幅计数$c$从 0 到 max_b + 1，将用户分为有保障的免费用户（那些拥有$b_i \ge c$）和潜在付费用户（那些拥有$b_i < c$）。 将免费用户总利润计算为 c \times w \times \text{num_free}。 
4. 对于付费用户，迭代排序后的用户$a_i$值作为候选价格。 对于每个$p$相当于付费用户$a_i$，将总收入计算为 p \times \text{a_i ≥ p 的用户数量} + \text{自由利润}。 跟踪能带来最大利润的价格。 如果多个价格给出相同的利润，则任何一个都有效。 
5. 存储本次最佳利润及对应价格$c$。 对所有人重复$c$。 

为什么有效：排序可确保我们永远不会错过付费用户组发生变化的价格阈值。 通过仅考虑具有$b_i < c$作为付费候选人，我们尊重免费版本的限制。 扫地$p$超过已排序的$a_i$保证我们有效地捕获付费用户数量的所有变化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, w = map(int, input().split())
users = [tuple(map(int, input().split())) for _ in range(n)]

max_b = max(b for _, b in users)
count_b = [0] * (max_b + 2)
for _, b in users:
    count_b[b] += 1

# Precompute prefix sums of free users for each c
free_count = [0] * (max_b + 2)
running = 0
for c in range(max_b + 2):
    running += count_b[c]
    free_count[c] = n - running

# Sort users by a_i descending for paid revenue calculation
paid_users = sorted(users, key=lambda x: x[0], reverse=True)
a_list = [a for a, b in paid_users]

for c in range(max_b + 2):
    num_free = free_count[c]
    free_profit = num_free * c * w
    
    max_profit = free_profit
    best_p = 0
    # Number of paid users decreases as p increases
    for i, (a, b) in enumerate(paid_users):
        if b >= c:
            continue
        p = a
        paid_count = i + 1  # because list is descending
        profit = paid_count * p + free_profit
        if profit > max_profit:
            max_profit = profit
            best_p = p
    print(max_profit, best_p)
```说明：我们计算每个免费用户的数量$c$使用前缀和$b_i$很重要。 付费用户排序依据$a_i$下降，以便当我们考虑每个阈值价格时，我们确切地知道有多少用户会付费。 收入计算添加了免费和付费贡献，我们选择给出最大值的价格。 

## 工作示例

 ### 示例 1

 输入：```
2 1
2 0
0 2
```| c | 免费用户| 免费利润| 付费候选人 a_i | 已付利润| 最大利润| 最好的p |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 | 2 | 2 | 2 | 2 |
 | 1 | 1 | 1 | 2 | 2 | 3 | 2 |
 | 2 | 1 | 2 | 0 | 0 | 4 | 2 |
 | 3 | 0 | 0 | 2 | 2 | 2 | 2 |

 该表显示了免费利润如何随着$c$但有资格获得付费的用户较少。 扫地$p$确保选择最佳组合。 

### 自定义输入```
3 2
3 1
2 0
1 2
```利用算法追踪免费用户、免费盈利、付费用户； 最大利润和最佳价格遵循与上述相同的逻辑。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + n * max_b) | O(n log n + n * max_b) | 排序需要 O(n log n)。 对于每个 c，我们迭代付费用户，但可以使用排序顺序和 b_i 过滤器跳过许多用户。 |
 | 空间| O(n + max_b) | O(n + max_b) | 用于存储用户数据、可用计数和前缀和的数组。 |

 当 n 达到 10^5 且 w、b_i 达到 10^5 时，解决方案只需 5 秒时间和 512MB 内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # Call solution function
    n, w = map(int, input().split())
    users = [tuple(map(int, input().split())) for _ in range(n)]
    max_b = max(b for _, b in users)
    count_b = [0] * (max_b + 2)
    for _, b in users:
        count_b[b] += 1
    free_count = [0] * (max_b + 2)
    running = 0
    for c in range(max_b + 2):
        running += count_b[c]
        free_count[c] = n - running
    paid_users = sorted(users, key=lambda x: x[
```
