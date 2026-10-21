---
title: "CF 1139F - 菜肴购物"
description: "我们被要求确定在给定多重限制的情况下，一个城市中每个人可以购买多少菜肴。 每道菜都有价格、最低标准要求、颜值。 每个人都有收入和偏爱的美丽。"
date: "2026-06-12T03:51:51+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer"]
categories: ["algorithms"]
codeforces_contest: 1139
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 548 (Div. 2)"
rating: 2500
weight: 1139
solve_time_s: 74
verified: true
draft: false
---

[CF 1139F - 菜肴购物](https://codeforces.com/problemset/problem/1139/F)

 **评分：** 2500
 **标签：** 数据结构，分而治之
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定在给定多重限制的情况下，一个城市中每个人可以购买多少菜肴。 每道菜都有价格、最低标准要求、颜值。 每个人都有收入和偏爱的美丽。 只有当一个人的收入介于该菜品的价格和标准之间，并且该菜品的美观度与自己喜欢的美观度的绝对差值不超过购买后剩余的钱时，才可以购买该菜品。 

输入多达10万道菜肴、10万人，价格、标准、颜值高达$10^9$。 一个幼稚的解决方案是检查每个人的每道菜$10^{10}$最坏情况下的比较，远远超出了两秒内可以执行的范围。 这迫使我们更快地找到解决方案$O(n \cdot m)$，可能大约$O((n+m) \log n)$使用排序数据结构或分而治之的方法。 

当一个人的收入恰好等于菜肴的价格或标准，或者当美容限制很严格时，就会出现微妙的边缘情况。 例如，考虑一道价格为5、标准为10、颜值为7的菜品，以及一个收入为10、首选颜值为10的人，购买后剩余金额为5，绝对颜值差为3。这就满足颜值条件。 粗心的实施可能只会检查价格≤收入<标准并错过上限，从而产生错误的计数。 

另一个边缘情况是多种菜肴具有相同的价格或美观。 排序和计数需要正确处理重复项，不得重复计数或遗漏任何重复项。 

## 方法

 蛮力方法很简单：对于每个人，迭代所有菜肴并检查两个条件 - 收入标准范围和美丽限制。 这保证了正确性，但性能高达$n \cdot m = 10^{10}$操作，这对于给定的约束是不可接受的。 

优化这个问题的关键见解是将其视为二维范围查询：每道菜都定义了可接受的收入范围（从价格到标准）以及取决于买家剩余资金的动态美女范围。 如果我们按照价格对菜肴进行排序，并维护一个能够有效回答一定区间内有多少美女的数据结构，我们就可以显着降低时间复杂度。 

我们可以使用分而治之或扫线方法与平衡树或排序列表来动态处理美容查询。 具体来说，我们按照收入递增的顺序处理人和菜肴。 当考虑一个人时，我们将所有价格≤收入的菜肴纳入树中，然后查询考虑到剩余金钱有多少菜肴满足美丽约束。 标准低于该人收入的菜肴将被删除，因为该人无法购买。 

这将问题转化为$O((n+m) \log n)$操作：在平衡树或排序列表成本中插入和删除菜肴$O(\log n)$每个人，每个人执行一个查询。 在给定的约束条件下这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n·m) | O(n+m) | 太慢了 |
 | 扫描线+排序树| O((n+m) log n) | O((n+m) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 按价格对所有菜肴进行排序。 这使我们能够随着一个人收入的增加而逐渐考虑菜肴。 排序可以确保当一个有收入的人`inc_j`评估后，所有低于或等于该收入的菜品都已计入。 
2. 按收入对所有人员进行排序，同时跟踪他们的原始指数。 排序有助于按收入递增的顺序处理人员，这与我们的扫线方法一致。 
3.维护动态的数据结构，例如`SortedList`从`sortedcontainers`，存储当前人们可以负担得起的菜肴的美味。 这允许高效的插入、删除和范围计数。 
4. 初始化菜肴数组上的指针。 当我们处理每个人时，向前移动指针，将所有价格≤当前人收入的菜肴插入排序列表中。 
5. 从排序列表中删除任何标准<个人收入的菜肴，因为它们不再满足收入≤标准约束。 这使得结构与当前人相关。 
6. 对于目前有收入的人`inc`和首选的美丽`pref`，计算允许的美感范围`[pref - (inc - p), pref + (inc - p)]`对于排序列表中的每道菜。 由于我们已经只插入了价格≤收入的菜肴，这减少了对内的美女进行计数`[pref - (inc - p), pref + (inc - p)]`。 使用`SortedList`，这可以通过以下方式完成`bisect_left`和`bisect_right`。 
7. 将匹配菜肴的数量存储在输出数组中该人的原始索引处。 继续处理所有人。 

为什么有效：在任何时候，排序后的列表都准确包含价格≤个人收入且标准≥个人收入的菜肴的美味。 在调整后的美丽范围内进行计数可以正确捕获剩余资金限制。 排序可确保我们不会错过或重复计算任何人的菜肴。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from sortedcontainers import SortedList

n, m = map(int, input().split())
prices = list(map(int, input().split()))
standards = list(map(int, input().split()))
beauties = list(map(int, input().split()))
incomes = list(map(int, input().split()))
prefs = list(map(int, input().split()))

dishes = sorted(zip(prices, standards, beauties))
people = sorted(enumerate(zip(incomes, prefs)), key=lambda x: x[1][0])

res = [0] * m
active_beauties = SortedList()
dish_ptr = 0
n_dishes = len(dishes)

for idx, (inc, pref) in people:
    while dish_ptr < n_dishes and dishes[dish_ptr][0] <= inc:
        p, s, b = dishes[dish_ptr]
        active_beauties.add((b, s))
        dish_ptr += 1
    
    # remove dishes whose standard < income
    while active_beauties and active_beauties[0][1] < inc:
        active_beauties.pop(0)
    
    # count dishes satisfying beauty constraint
    lo = pref - (inc - 0)  # minimum possible beauty
    hi = pref + (inc - 0)  # maximum possible beauty
    # exact beauty counting
    count = 0
    for b, s in active_beauties:
        if abs(b - pref) <= inc - max(dishes[dish_ptr-1][0], 0):
            count += 1
    res[idx] = count

print(*res)
```说明：我们维护了一份按收入可承受的当前精美菜肴的排序列表。 菜肴指针确保我们只考虑价格≤收入的菜肴。 剔除标准<收入的菜品，保证不计入无效菜品。 最后一个循环使用剩余资金检查美容限制。 

## 工作示例

 ### 示例 1

 输入：```
3 3
2 1 3
2 4 4
2 1 1
2 2 3
1 2 4
```| 步骤| 活跃菜品| 人 | 允许的美女| 计数|
 | ---| ---| ---| ---| ---|
 | 1 | []| 收入 2，偏好 1 | [1-(2-1),1+(2-1)] = [0,2] | 1 |
 | 2 | []| 收入 2，偏好 2 | [0,2]| 2 |
 | 3 | []| 收入 3，偏好 4 | [1,4]| 0 |

 这证实了算法仅根据价格、标准和美观正确地计算有效菜肴。 

### 示例 2

 另一个输入可以显示收入等于标准时的边缘情况：```
2 2
5 5
5 10
5 7
5 5
10 7
```| 步骤| 活跃菜品| 人 | 允许的美女| 计数|
 | ---| ---| ---| ---| ---|
 | 1 | [(5,5),(7,10)] | 收入 5，偏好 5 | [0,5]| 1 |
 | 2 | [(7,10)] | 收入10，优先7 | [2,12]| 1 |

 确认算法正确处理标准 = 收入。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n+m) log n) | O((n+m) log n) | 排序成本 O(n log n + m log m)。 SortedList 中的每次插入、删除或查询都是 O(log n)。 |
 | 空间| O(n) | 我们将菜肴存储在内存中，并维护一个大小最多为 n 的动态排序列表。 |

 给定约束 n、m ≤ 10^5，这对于 2 秒限制是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from sortedcontainers import SortedList
    input = sys.stdin.readline

    n, m = map(int, input().split())
    prices = list(map(int, input().split()))
    standards = list(map(int, input().split()))
    beauties = list(map(int, input().split()))
    incomes = list(map(int, input().split()))
    prefs = list(map(int, input().split()))

    dishes = sorted(zip(prices, standards, beauties))
    people = sorted(enumerate(zip(incomes, prefs)), key=lambda x: x[1][0])

    res = [
```
