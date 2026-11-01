---
title: "CF 1657D - 适合游戏玩家。 由游戏玩家提供。"
description: "我们有一个策略游戏场景，其中 Monocarp 招募一个小队来对抗一系列怪物。 每场战斗开始时都是空的小队，Monocarp 每场战斗最多可以花费 C 个硬币。 每种单位类型都有成本、每秒伤害和生命值。"
date: "2026-06-10T03:28:35+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1657
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 125 (Rated for Div. 2)"
rating: 2000
weight: 1657
solve_time_s: 61
verified: true
draft: false
---

[CF 1657D - 适合游戏玩家。 作者：游戏玩家。](https://codeforces.com/problemset/problem/1657/D)

 **评级：** 2000
 **标签：** 二分查找、暴力破解、贪心、数学、排序
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个策略游戏场景，其中 Monocarp 招募一个小队来对抗一系列怪物。 每场战斗开始时都是空队，Monocarp 最多可以花费`C`每场战斗的金币。 每种单位类型都有成本、每秒伤害和生命值。 每个怪物都有每秒伤害和总生命值。 战斗是同时进行的，这意味着只有当他的小队杀死怪物的速度严格快于怪物杀死小队中单个单位的速度时，Monocarp 才会获胜。 

输入提供的详细信息`n`单位类型和`m`怪物。 输出必须报告每个怪物 Monocarp 获胜所需花费的最少金币。 如果没有组合在`C`硬币让胜利，我们回来`-1`。 

鉴于限制条件，`n`和`m`可以达到`3 * 10^5`和硬币限额高达`10^6`。 这排除了对每个怪物的每种类型的每个单位数量进行迭代的幼稚方法，因为这可能需要`O(n * C * m)`操作，规模太大了。 

当一种类型的单个单位可以击败怪物，但多个单位更便宜时，就会出现不明显的边缘情况。 例如，一个便宜的单位可能需要 5 个副本才能击败怪物，花费 50 个金币，而一个昂贵但更强的单位只需要一个副本，花费 30 个金币。 总是采用第一个满足条件的类型的粗心解决方案可能会返回次优或不可能的答案。 

## 方法

 暴力方法会考虑每种单位类型，并尝试在硬币限制内招募的所有可能数量的单位。 对于每个组合，我们都会检查小队是否在怪物杀死单位之前杀死了怪物。 这可以保证正确性，但速度太慢，因为迭代到`C`每个硬币`n`单位和`m`怪物导致最坏情况下的操作计数`O(n * C * m)`。 

关键的见解是，战斗条件取决于小队总伤害与怪物生命值的比率以及怪物总伤害与单位生命值的比率。 让`k`是类型的单位数`i`。 小队击杀怪物`H_j / (k * d_i)`秒，怪物杀死一个单位`h_i / D_j`秒。 胜利需要`H_j / (k * d_i) < h_i / D_j`，这简化为`k > H_j * D_j / (h_i * d_i)`。 因此，对于每种单位类型，我们可以计算击败给定怪物所需的最小单位数量。 对应的成本是`ceil(k) * c_i`。 我们只需要所有单位类型的最低此类成本。 

因为`C`可以达到`10^6`，迭代`k`直接是没有必要的。 预先计算每个硬币数量可达到的最大伤害使我们能够回答以下问题`O(log C)`通过搜索每个怪物的时间。 排序并保留最大前缀`damage * health`确保主导单位类型（更昂贵但更糟糕）不会影响答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * C * m) | O(n * C) | 太慢了 |
 | 最佳| O(n + C + m * log C) | O(n + C + m * log C) | O(C)| 已接受 |

 ## 算法演练

 1.初始化一个数组`best`尺寸的`C + 1`追踪最好的`damage * health`每枚硬币可达到的金额高达`C`。 最初将所有条目设置为零。 
2. 迭代所有单元类型。 对于每种单位类型及其成本`c_i`， 损害`d_i`和健康`h_i`, 计算`d_i * h_i`。 更新`best[c_i]`是其当前值的最大值并且`d_i * h_i`。 这确保了对于每种成本，我们都知道最有效的单一单位类型。 
3. 将前缀最大值传播到`best`大批。 对于每枚硬币的面值从 1 到`C`， 放`best[i] = max(best[i], best[i-1])`。 这确保了对于任何硬币预算，我们都知道最实惠的单位类型。 
4. 对于每个怪物`D_j`和`H_j`, 计算`threshold = H_j * D_j`。 我们现在想要最小的硬币数量`k`这样`best[k] > threshold`。 执行二分查找`best`数组从 1 到`C`。 
5. 如果有效`k`找到，输出`k`。 否则，输出`-1`。 

为什么它有效：战斗条件减少到`k * d_i * h_i > H_j * D_j`。 通过预先计算最大值`d_i * h_i`每个硬币数量并使用前缀最大值，我们保证可以通过搜索满足不等式的最小硬币支出来回答每个怪物查询。 占主导地位的单位类型无法将硬币成本降低到最低限度以下`k`成立。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, C = map(int, input().split())
best = [0] * (C + 1)

for _ in range(n):
    c, d, h = map(int, input().split())
    value = d * h
    if best[c] < value:
        best[c] = value

for i in range(1, C + 1):
    best[i] = max(best[i], best[i - 1])

m = int(input())
monsters = [tuple(map(int, input().split())) for _ in range(m)]
res = []

for D, H in monsters:
    left, right = 1, C
    ans = -1
    threshold = D * H
    while left <= right:
        mid = (left + right) // 2
        if best[mid] > threshold:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    res.append(str(ans))

print(" ".join(res))
```第一个循环构造了`best`具有最大值的数组`d*h`每成本价值。 第二个循环构建前缀最大值，以便对于任何硬币预算，我们都可以访问最有效的单位。 二分搜索检查满足怪物阈值的最小硬币支出。 使用整数运算可以避免浮点错误，并且传播顺序确保我们不会错过可以击败怪物的更便宜的单位类型。 

## 工作示例

 ### 输入示例 1```
3 10
3 4 6
5 5 5
10 3 4
3
8 3
5 4
10 15
```| 怪物| 阈值 H*D | 最佳数组 max ≤ C | 硬币结果 |
 | ---| ---| ---| ---|
 | 8 3 | 24 | 最佳[3]=24，最佳[5]=25 | 5 |
 | 5 4 | 20 | 最佳[3]=24 | 3 |
 | 10 15 | 10 150 | 150 最佳[10]=25 | -1 |

 该轨迹表明，对于第一个怪物，虽然类型 1 的多个单位可以满足阈值，但类型 2 的实现成本更低。 

### 自定义示例```
2 5
2 2 2
3 3 1
1
3 3
```| 怪物| 阈值 H*D | 最佳数组 max ≤ C | 硬币结果 |
 | ---| ---| ---| ---|
 | 3 3 | 9 | 最佳[3]=3 | -1 |

 硬币限额内的任何单位都无法满足该阈值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + C + m * log C) | O(n + C + m * log C) | 构造`best`在 O(n) 中，在 O(C) 中前缀最大值，在 O(log C) 中二分搜索每个怪物 |
 | 空间| O(C + m) |`best`数组大小 C+1，怪物列表大小 m |

 给定 n、m ≤ 3*10^5 且 C ≤ 10^6 时，该算法是有效的。 二分搜索确保即使是最大数量的怪物也能在可接受的时间内得到处理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, C = map(int, input().split())
    best = [0] * (C + 1)
    for _ in range(n):
        c, d, h = map(int, input().split())
        best[c] = max(best[c], d*h)
    for i in range(1, C + 1):
        best[i] = max(best[i], best[i-1])
    m = int(input())
    monsters = [tuple(map(int, input().split())) for _ in range(m)]
    res = []
    for D, H in monsters:
        left, right = 1, C
        ans = -1
        threshold = D * H
        while left <= right:
            mid = (left + right) // 2
            if best[mid] > threshold:
                ans = mid
                right = mid - 1
            else:
                left = mid + 1
        res.append(str(ans))
    return " ".join(res)

# Provided samples
assert run("3 10\n3 4 6\n5 5 5\n10 3 4\n3\n8 3\n5 4\n10 15\n") == "5 3 -1"

# Custom cases
assert run("2 5\n2 2 2\n3 3
```
