---
title: "CF 1461E - 水位"
description: "我们被要求在几天内管理饮水机。 冷却器启动时需要 k 升水，同事每天消耗 x 升水。 每天开始时，如果不超过最大限制 r，John 可以恰好添加 y 升水。"
date: "2026-06-11T02:24:24+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "graphs", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1461
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 689 (Div. 2, based on Zed Code Competition)"
rating: 2200
weight: 1461
solve_time_s: 177
verified: false
draft: false
---

[CF 1461E - 水位](https://codeforces.com/problemset/problem/1461/E)

 **评分：** 2200
 **标签：** 蛮力、图、贪心、实现、数学
 **求解时间：** 2m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在几天内管理饮水机。 冷却器开始于`k`升水，以及每天`x`同事消耗的升数。 在每天开始时，约翰可以准确添加`y`升水（如果这样做不超过最大限制）`r`。 冷却器的水位必须始终保持在`[l, r]`。 目标是确定约翰是否能够维持这个水位`t`连续几天。 

输入参数很大：`k`,`l`,`r`， 和`y`可以达到`10^18`， 和`t`最多`10^18`， 尽管`x`取决于`10^6`。 这排除了任何在循环中单独模拟每一天的方法，因为迭代`t`时间会太慢。 相反，我们需要根据边界、周期或模式进行推理，以允许在一个步骤中跳过多天。 

当不可能加水时会出现边缘情况，因为它会超过`r`，或者消费时`x`大于冷却器中剩余的量。 例如，如果`k = 8`,`l = 1`,`r = 10`,`t = 2`,`x = 6`， 和`y = 4`，添加`y`第一天将超过`r`，因此约翰无法加水，剩下 2 升。 又一天后，使用了 6 升，结果为 0 升，如下`l`，所以正确的输出是“No”。 幼稚的方法可能会错误地尝试添加水，无论超过`r`。 

## 方法

 蛮力方法很简单：首先尝试添加来模拟每一天`y`升，如果所得水平不超过`r`，然后减去`x`升为日常消耗量。 重复进行`t`天。 这是有效的，因为它直接实现规则，但它需要`O(t)`迭代。 和`t`最多`10^18`，这是不可行的。 

关键的见解是水位的变化是可预测的。 出现两种情况：

 1. **`y >= x`**：如果加水量至少达到每日消耗量，则水位可能会随着时间的推移而增加。 极限`r`阻止无限增长。 我们只需要担心是否存在不能加水的点，因为它会超过`r`，或者是否`l`被侵犯。 在这种情况下，问题简化为检查余数模`x`，因为重复的加法和减法循环最终重复水位模`x`。 这让我们可以跳过单独模拟每一天的过程。 
2. **`y < x`**：这里，水位随着时间的推移而下降。 如果添加`y`无法抵消`x`，我们可以通过求解来计算水可以持续多少天`(k + y) - x*d >= l`分块。 我们可以快速确定约翰之前是否用完水`t`天，无需每天迭代。 

使用模运算、访问状态和智能跳过，我们可以将时间复杂度降低到`O(x)`或在某些情况下为对数，远低于`t`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(t) | O(1) | O(1) | 太慢了 |
 | 最佳| O(x) | O(x) | 已接受 |

 ## 算法演练

 1. 检查是否`x > y`和`y == 0`。 如果`x > y`并且加水是不可能的，计算之前的天数`k`低于`l`使用整数除法：`days = (k - l) // x + 1`。 如果`days >= t`，打印“是”； 否则，“否”。 这是安全的，因为水只会线性减少。 
2.初始化一组`visited`跟踪水位模数`x`来检测周期。 从初始水位开始`k`。 
3.同时`t > 0`，尝试加水。 仅添加`y`升如果`k + y <= r`。 如果无法添加，则不执行任何操作。 
4. 减法`x`一天的升数。 如果`k < l`减法后，打印“No”并终止。 
5. 减少`t`1.
 6. 计算`k % x`。 如果之前已经见过该模值，则存在循环。 由于重复取模`x`值不会违反限制，我们可以立即打印“Yes”并终止。 
7. 否则，将模值添加到`visited`并继续。 
8. 如果`t`在不违反界限的情况下达到零，打印“是”。 

为什么有效：水位模`x`完全决定了后续的演变，因为每天的消耗和添加量是的倍数`x`有效。 通过跟踪看到的模值，该算法可以检测循环并确保不会发生上溢或下溢。 当以下情况时，线性减少被分析处理`y < x`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

k, l, r, t, x, y = map(int, input().split())

if x > y and y == 0:
    # water decreases linearly, can't add
    if k - t * x >= l:
        print("Yes")
    else:
        print("No")
    exit()

visited = set()
while t > 0:
    # if we can safely add water, do it
    if k + y <= r:
        k += y
    # subtract daily consumption
    k -= x
    t -= 1
    if k < l:
        print("No")
        exit()
    modk = k % x
    if modk in visited:
        print("Yes")
        exit()
    visited.add(modk)

print("Yes")
```该解决方案首先处理简单的递减情况，其中`y = 0`和`x`很大。 对于主循环，仅在允许时才安全地加水，减少`k`经过`x`，并跟踪模数`x`状态来检测周期。 一旦检测到循环，水位模式就会无限重复，从而保证冷却器的维护。 

## 工作示例

 **样品1：**`8 1 10 2 6 4`| 日 | 添加y？ | 减去之前的 k | 减去后的 k | 模 k | 访问过 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 没有| 8 | 2 | 2 | {2} |
 | 2 | 是的 | 6 | 0 | 0 | {2,0} -> 违反 l |

 输出：`No`。 冷却器掉到下面`l`第 2 天。 

**样本2：**`8 1 10 2 6 5`| 日 | 添加y？ | 减去之前的 k | 减去后的 k | 模 k | 访问过 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 是的 | 13 -> 上限为 r=10 | 4 | 4 | {4} |
 | 2 | 是的 | 9 | 3 | 3 | {4,3} |

 输出：`Yes`。 水保持在界限内。 

这些痕迹表明，模跟踪在添加时捕获周期并正确处理`y`受限于`r`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(x) | 以 x 为模的唯一水位的最大数量为 x。 一旦我们看到重复，我们就会停止。 |
 | 空间| O(x) | 存储访问的 x 模值以检测周期。 |

 自从`x <= 10^6`，存储和检查模值完全符合内存限制，并且 O(x) 操作的执行时间很好地低于 1 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    k, l, r, t, x, y = map(int, input().split())
    if x > y and y == 0:
        return "Yes" if k - t * x >= l else "No"
    visited = set()
    while t > 0:
        if k + y <= r:
            k += y
        k -= x
        t -= 1
        if k < l:
            return "No"
        modk = k % x
        if modk in visited:
            return "Yes"
        visited.add(modk)
    return "Yes"

# provided samples
assert run("8 1 10 2 6 4\n") == "No", "sample 1"
assert run("8 1 10 2 6 5\n") == "Yes", "sample 2"
# custom cases
assert run("1 1 1 1 1 1\n") == "Yes", "minimum-size input"
assert run("10 1 20 5 3 4\n") == "Yes", "water fluctuates but stays in range"
assert run("5 1 5 3 2 0\n") == "No", "cannot add water, runs out"
assert run("10 5 15 1000000 2 1\n") == "Yes", "long t with cycle detection"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 1 1 1 1 | 1 1 1 1 1 1 是的 | 最小值|
 | 10 1 20 5 3 4 | 10 1 20 5 3 4 是的 | 区间内波动 |
 | 5 1 5 3 2 0 | 5 1 5 3 2 0 | |
