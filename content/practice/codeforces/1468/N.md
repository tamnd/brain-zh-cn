---
title: "CF 1468N - 废物分类"
description: "Monocarp 需要将几种不同类型的物品扔进三个具有固定容量的容器中。 第一个容器仅接受纸质物品，第二个容器仅接受塑料物品，第三个容器接受所有其他类型的物品。"
date: "2026-06-11T01:33:25+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1468
codeforces_index: "N"
codeforces_contest_name: "2020-2021 ICPC, NERC, Southern and Volga Russian Regional Contest (Online Mirror, ICPC Rules)"
rating: 900
weight: 1468
solve_time_s: 109
verified: true
draft: false
---

[CF 1468N - 垃圾分类](https://codeforces.com/problemset/problem/1468/N)

 **评分：** 900
 **标签：** 贪心，实现
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Monocarp 需要将几种不同类型的物品扔进三个具有固定容量的容器中。 第一个容器仅接受纸质物品，第二个容器仅接受塑料物品，第三个容器接受所有其他类型的物品。 Monocarp 有一些完全是纸的、完全是塑料的或完全是其他的物品，但他也有部分是纸或部分是塑料的物品，这些物品可以放入各自的主容器或第三个容器中。 问题是所有物品是否都能装下而不超过任何容器的容量。 

输入给出了多个测试用例。 每个测试用例指定三个容器的容量以及 Monocarp 拥有的每种类型物品的数量。 如果可以放置符合容量的所有物品，则输出为 YES，否则输出为 NO。 

约束允许最多$3 \cdot 10^4$测试用例，每个值可以大到$10^8$。 这排除了任何尝试枚举部分项目组合的解决方案，因为可能性的数量可能是天文数字。 该解决方案必须依赖于算术检查和简单的比较。 

当容器的容量小于该容器的强制物品时，就会出现边缘情况。 例如，如果纸质容器只能容纳 1 个物品，但 Monocarp 严格限制有 2 个纸质物品，则不分配部分纸质物品就无法弥补。 当部分纸质或部分塑料的物品必须溢出到第三个容器中时，会发生另一种微妙的情况。 如果第三个容器由于其他物品已经接近容量，我们必须检查添加这些灵活物品是否仍然适合。 

## 方法

 暴力方法将尝试在其主容器和第三容器之间分配部分纸和部分塑料的物品的所有可能的分配方式。 例如，如果有$a_4$部分纸质物品，我们可以尝试从第一个容器中的 0 到第一个容器中的所有拆分。 总组合将是$(a_4+1) \cdot (a_5+1)$，当$a_4$或者$a_5$可以是$10^8$。 

最佳方法认识到我们不需要枚举拆分。 对于第一个容器，我们必须放置所有严格的纸质物品。 任何剩余的容量都可以用部分纸质物品填充，其余的必须放入第三个容器中。 类似的逻辑适用于第二个容器和部分塑料制品。 最后，我们检查第三个容器是否可以容纳其所有基本项目以及部分项目的溢出。 这将问题简化为简单的算术比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(a4 * a5) | O(1) | O(1) | 太慢了|
 | 最佳 | 每个测试用例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取容量$c_1$,$c_2$,$c_3$和该项目计数$a_1$通过$a_5$。 
2. 检查严格纸质物品是否适合第一个容器。 计算放置所有严格纸质物品后的剩余容量：`rem1 = c1 - a1`。 如果`rem1`是否定的，打印 NO 并继续下一个测试用例。 
3. 使用第一个容器中的剩余容量来放置部分纸质物品。 如果`a4`超过`rem1`，多余的必须进入第三个容器。 计算该溢出：`overflow_paper = max(0, a4 - rem1)`。 
4. 对装有严格塑料物品和部分塑料物品的第二个容器重复相同的逻辑。 计算第三个容器的溢出：`overflow_plastic = max(0, a5 - (c2 - a2))`。 如果严格的项目不适合，请打印NO。 
5. 最后，检查第三个容器是否可以容纳所有严格的其他物品以及部分纸质和部分塑料物品的溢出物：`total_in_third = a3 + overflow_paper + overflow_plastic`。 如果`total_in_third > c3`，打印NO。 否则，打印 YES。 

为什么有效：在每一步中，我们总是首先将强制性物品放入其所需的容器中。 仅当主容器无法容纳部分柔性物品时，才会将其移至第三个容器。 这保证了集装箱不会超出容量，并且我们遵守物品限制。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    c1, c2, c3 = map(int, input().split())
    a1, a2, a3, a4, a5 = map(int, input().split())
    
    rem1 = c1 - a1
    if rem1 < 0:
        print("NO")
        continue
    overflow_paper = max(0, a4 - rem1)
    
    rem2 = c2 - a2
    if rem2 < 0:
        print("NO")
        continue
    overflow_plastic = max(0, a5 - rem2)
    
    if a3 + overflow_paper + overflow_plastic <= c3:
        print("YES")
    else:
        print("NO")
```该代码首先从容器中减去强制项目，然后计算有多少灵活项目溢出到第三个容器中。 使用`max(0, ...)`确保我们减去的容量永远不会超过可用容量。 每个比较都直接对应一个容器容量限制。 

## 工作示例

 ### 输入示例 1```
c1=2, c2=2, c3=3
a1=1, a2=2, a3=3, a4=1, a5=0
```| 步骤| 雷姆1 | 溢出纸 | 雷姆2 | 溢出塑料| 第三个总数 | 输出|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 2-1=1 | 2-1=1 最大(0,1-1)=0 | 2-2=0 | 2-2=0 最大(0,0-0)=0 | 3+0+0=3 | 是 |

 严格的纸张适合第一个容器，部分纸质物品也适合那里，第三个容器可以容纳所有物品。 

### 输入示例 2```
c1=2, c2=2, c3=3
a1=1, a2=2, a3=3, a4=0, a5=1
```| 步骤| 雷姆1 | 溢出纸 | 雷姆2 | 溢出塑料| 第三个总数 | 输出|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 2-1=1 | 2-1=1 最大(0,0-1)=0 | 2-2=0 | 2-2=0 最大(0,1-0)=1 | 3+0+1=4 | 否 |

 部分塑料物品溢出到第三个容器，然后超出其容量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t) | 每个测试用例都需要一些算术运算。 |
 | 空间| O(1) | O(1) | 没有额外的内存随输入大小而变化。 |

 考虑到约束条件$t \le 3\cdot10^4$，每个测试用例仅使用恒定时间，因此解决方案在 2 秒内运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        c1, c2, c3 = map(int, input().split())
        a1, a2, a3, a4, a5 = map(int, input().split())
        
        rem1 = c1 - a1
        if rem1 < 0:
            output.append("NO")
            continue
        overflow_paper = max(0, a4 - rem1)
        
        rem2 = c2 - a2
        if rem2 < 0:
            output.append("NO")
            continue
        overflow_plastic = max(0, a5 - rem2)
        
        if a3 + overflow_paper + overflow_plastic <= c3:
            output.append("YES")
        else:
            output.append("NO")
    return "\n".join(output)

# Provided samples
assert run("7\n1 2 3\n1 2 3 0 0\n2 2 3\n1 2 3 1 0\n2 2 3\n1 2 3 0 1\n1 2 5\n1 2 3 1 1\n0 0 0\n0 0 0 0 0\n0 0 4\n1 0 0 0 0\n13 37 42\n0 0 0 40 47\n") == "YES\nYES\nNO\nYES\nYES\nNO\nYES"

# Custom cases
assert run("1\n0 0 0\n0 0 0 0 0\n") == "YES"  # all zero capacities, no items
assert run("1\n1 1 1\n1 0 0 0 0\n") == "YES"  # exactly fits in first container
assert run("1\n1 1 1\n2 0 0 0 0\n") == "NO"   # first container over capacity
assert run("1\n1 1 1\n0 0 1 1 1\n") == "
```
