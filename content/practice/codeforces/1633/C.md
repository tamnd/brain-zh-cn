---
title: "CF 1633C - 杀死怪物"
description: "问题是 Monocarp 的角色和怪物之间的回合制战斗模拟。 每个都有初始生命值和攻击力。"
date: "2026-06-10T04:48:20+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "math"]
categories: ["algorithms"]
codeforces_contest: 1633
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 122 (Rated for Div. 2)"
rating: 1100
weight: 1633
solve_time_s: 77
verified: true
draft: false
---

[CF 1633C - 杀死怪物](https://codeforces.com/problemset/problem/1633/C)

 **评分：** 1100
 **标签：** 蛮力，数学
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 问题是 Monocarp 的角色和怪物之间的回合制战斗模拟。 每个都有初始生命值和攻击力。 在每个回合中，角色首先攻击，根据怪物当前的攻击值减少角色的生命值，然后怪物进行反击，根据怪物的攻击减少角色的生命值。 这种情况会交替进行，直到其中一个生命值达到零或负值。 目标是确定 Monocarp 是否可以通过花费一定数量的金币来升级角色的攻击和/或生命值来保证胜利。 

输入指定测试用例的数量。 对于每个测试用例，我们都会获得角色的生命值和攻击力、怪物的生命值和攻击力、可用硬币的数量以及每枚硬币对生命值和攻击力升级的好处。 输出是简单的“是”或“否”，指示是否可以取得胜利。 

限制允许非常大的数字：角色和怪物的生命值可以达到$10^{15}$, 硬币最多$2 \cdot 10^5$，并且升级大小为$10^{10}$。 由于测试用例的数量可以$5 \cdot 10^4$，解决方案必须有效地处理每个测试用例，大致为$O(k)$或者更好，因为每回合的简单模拟都会超出时间限制。 

非明显的边缘情况包括角色在没有升级的情况下已经获胜的情况，所有硬币都应该最佳地用于攻击或健康，以及硬币数量为零的情况。 例如，如果$h_C = 1$,$d_C = 1$,$h_M = 1$,$d_M = 10$， 和$k = 0$，Monocarp 连一次打击都无法存活，因此正确的输出是 NO。 总是尝试升级而不考虑当前统计数据的幼稚方法可能会错误地报告“是”。 

## 方法

 暴力方法是尝试所有方法在健康和攻击升级之间分配硬币。 对于每种分布，我们都会通过迭代回合来模拟战斗，直到一方死亡。 这是有效的，因为每种升级组合都是有效的，并且模拟准确地反映了规则。 然而，在最坏的情况下，也有$k+1$尝试发行版，并模拟与最多$10^{15}$健康是不可能的。 即使天真地计算匝数也太慢了。 因此，暴力破解是不切实际的。 

关键的见解是，可以通过数学方式计算双方生存的回合数，而无需模拟每次攻击。 角色杀死了怪物$\lceil h_M / d_C' \rceil$转弯，哪里$d_C' = d_C + w \cdot x$和$x$是攻击所花费的金币数量。 怪物杀死了角色$\lceil h_C' / d_M \rceil$转弯，哪里$h_C' = h_C + a \cdot (k - x)$为了健康所花费的金币。 如果角色的回合数小于或等于怪物的回合数，则 Monocarp 获胜。 这将问题减少到检查$k+1$每个测试用例的简单计算。 

因此，我们可以迭代攻击和健康之间所有可能的硬币分割，使用整数算术计算击败每一方的回合数，并检查是否至少有一个分割可以保证胜利。 自从$k$至多是$2 \cdot 10^5$和总和$k$所有测试用例不超过$2 \cdot 10^5$，这种方法是有效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(k * 最大值(h_M, h_C)) | O(1) | O(1) | 太慢了 |
 | 最优数学| 每个测试用例的 O(k) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取初始角色和怪物统计数据，以及硬币数量及其好处。 
2. 循环遍历在攻击和生命值之间分配硬币的所有可能方法，从 0 个硬币到攻击最多$k$。 
3. 对于每个分割，计算新的攻击$d_C' = d_C + w \cdot x$和新健康$h_C' = h_C + a \cdot (k - x)$。 
4. 计算角色击败怪物所需的回合数：$\text{turns}_C = \lceil h_M / d_C' \rceil$。 
5. 计算怪物击败角色所需的回合数：$\text{turns}_M = \lceil h_C' / d_M \rceil$。 
6. 如果$\text{turns}_C \le \text{turns}_M$对于任何拆分，立即对此测试用例得出“是”的结论。 否则，在检查所有拆分后，得出“否”的结论。 
7. 为每个测试用例打印“是”或“否”。 

为什么有效：通过迭代所有可行的硬币分布并以数学方式计算生存时间，我们保证考虑所有最佳升级。 由于战斗回合是确定性的且严格递减，因此回合计数的比较可以正确确定结果。 循环结束$k+1$可能性足以捕获任何最佳组合，因此不会错过任何有效的获胜分布。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import math

t = int(input())
for _ in range(t):
    hC, dC = map(int, input().split())
    hM, dM = map(int, input().split())
    k, w, a = map(int, input().split())
    
    possible = False
    for coins_attack in range(k + 1):
        coins_health = k - coins_attack
        new_attack = dC + coins_attack * w
        new_health = hC + coins_health * a
        
        turns_to_kill_monster = (hM + new_attack - 1) // new_attack
        turns_to_survive = (new_health + dM - 1) // dM
        
        if turns_to_kill_monster <= turns_to_survive:
            possible = True
            break
    
    print("YES" if possible else "NO")
```该解决方案首先使用有效地读取输入`sys.stdin.readline`。 对于每个测试用例，它迭代所有硬币分布，计算所得的攻击和健康状况，并通过整数算术使用上限除法计算回合数。 当发现获胜分布时，循环立即中断，以避免不必要的计算。 零硬币、零升级值或已经足够的统计数据等边缘情况自然会得到处理，因为所有发行版（包括无升级）都经过测试。 

## 工作示例

 输入示例：```
25 4
9 20
1 1 10
```| 攻击的硬币| 硬币给健康| 新攻击| 新健康| 转身杀怪| 转身生存| 赢了？ |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 4 | 35 | 35 3 | 2 | 没有 |
 | 1 | 0 | 5 | 25 | 25 2 | 2 | 是的 |

 这里，攻击花费1金币可以让角色在2回合内杀死怪物，存活2回合，因此有可能获胜。 

另一个例子：```
25 4
12 20
1 1 10
```| 攻击的硬币| 硬币给健康| 新攻击| 新健康| 转身杀怪| 转身生存| 赢了？ |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 4 | 35 | 35 3 | 2 | 没有 |
 | 1 | 0 | 5 | 25 | 25 3 | 2 | 没有 |

 在这里，两种分配都不允许在死前杀死怪物，所以答案是否定的。 

这些痕迹表明该算法正确计算回合数并评估所有可能的硬币分配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例的 O(k) | 我们迭代 k 个硬币的所有可能的分割，并为每个分割计算整数算术运算。 所有测试用例的 k 总和 ≤ 2_10^5，因此总操作数 ≤ 2_10^5。 |
 | 空间| O(1) | O(1) | 每个测试用例仅存储几个整数变量。 |

 考虑到这些限制，该解决方案非常适合 2 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())  # assuming solution is in solution.py
    return output.getvalue().strip()

# provided samples
assert run("4\n25 4\n9 20\n1 1 10\n25 4\n12 20\n1 1 10\n100 1\n45 2\n0 4 10\n9 2\n69 2\n4 2 7\n") == \
       "YES\nNO\nYES\nYES", "sample 1"

# custom cases
assert run("1\n1 1\n10 1\n0 1 1\n") == "NO", "minimum coins, cannot survive"
assert run("1\n10 5\n10 5\n10 1 1\n") == "YES", "already winning without upgrades"
assert run("1\n5 5\n20 10\n5 2 5\n") == "YES",
```
