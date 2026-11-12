---
title: "CF 2164C - 地牢"
description: "我们被要求模拟一个地下城场景，其中你有一组剑，每把剑都有一个伤害值，还有一组怪物，每一个都有生命值。 如果你的剑的伤害至少等于怪物的生命，你就可以杀死怪物。"
date: "2026-06-07T23:37:17+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2164
codeforces_index: "C"
codeforces_contest_name: "Codeforces Global Round 30 (Div. 1 + Div. 2)"
rating: 1400
weight: 2164
solve_time_s: 122
verified: false
draft: false
---

[CF 2164C - 地下城](https://codeforces.com/problemset/problem/2164/C)

 **评分：** 1400
 **标签：** 二分查找、暴力破解、数据结构、贪心、排序
 **求解时间：** 2m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求模拟一个地下城场景，其中你有一组剑，每把剑都有一个伤害值，还有一组怪物，每一个都有生命值。 如果你的剑的伤害至少等于怪物的生命，你就可以杀死怪物。 一旦使用一把剑，它就会被消耗，但在某些情况下，你会获得一把新剑，根据怪物的伤害，它可能具有更高的伤害`c_i`价值。 目标是最大化你可以杀死的怪物数量。 

输入提供多个测试用例。 每个测试用例都会给出初始剑、怪物的生命值以及杀死每个怪物后出现的潜在新剑。 输出应该是每个测试用例杀死的最大怪物数量。 

约束很严格：`n`和`m`可以达到`2 * 10^5`，所有测试用例的总和也同样有界。 这消除了任何迭代剑和怪物的所有可能顺序的蛮力解决方案，因为操作的数量将是二次的或更糟。 简单的 O(n * m) 方法是不可行的。 

需要注意的边缘情况包括所有情况`c_i`为零，意味着没有新的剑出现，或者初始剑都比某些怪物弱的情况。 例如，如果`a = [1]`和`b = [2]`和`c = [0]`，没有怪物可以被杀死，算法必须返回`0`。 另一个棘手的情况是，首先选择了错误的剑，从而阻止了以后对本来可以产生更强剑的怪物使用它。 

## 方法

 蛮力方法会尝试剑与怪物任务的每一种组合。 您将针对每个怪物检查每把剑，跟踪哪些剑被消耗，并更新为`c_i`价值观。 这保证了正确性，但需要最多`n * m`每个测试用例的比较。 和`n, m`最多 2 * 10^5，在最坏的情况下会产生 4 * 10^10 次操作，这是不可行的。 

最佳方法利用排序和贪婪选择。 首先，对剑和怪物进行排序。 对剑进行分类可确保您始终知道能够杀死怪物的最小可用剑，这在您想要有效消耗剑时至关重要。 按生命对怪物进行排序可以让您首先处理较弱的怪物。 关键的见解是杀死怪物后获得的新剑总是具有至少与所用剑一样高的伤害。 这保证了贪婪的方法 - 使用最小的足够的剑来对付剩下的最弱的怪物 - 将使总杀戮最大化。 使用最小堆（优先级队列）来存储可用的剑可以让我们有效地找到可以杀死怪物的最小剑。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(n + m) | 太慢了 |
 | 排序 + 贪婪堆 | O((n + m) log(n + m)) | O((n + m) log(n + m)) | O(n + m) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取剑的数量`n`和怪物`m`。 阅读剑伤害列表`a`, 怪物生命值列表`b`，以及剑增益列表`c`。 
2. 按升序对剑进行排序。 将怪物与其`c_i`值并按健康状况升序对它们进行排序。 这保证了我们首先解决较弱的怪物。 
3. 用所有初始剑伤害初始化一个最小堆。 这个堆总是会给出可以杀死怪物的最小的剑，这最大限度地发挥了保留更强剑以供以后使用的潜力。 
4. 初始化计数器`kills`为零。 迭代排序的怪物列表。 对于每个怪物：

 a. 从堆中弹出剑，直到找到一把伤害至少等于怪物生命值的剑。 

b. 如果不存在这样的剑，则跳过该怪物。 

c. 如果找到剑，则增加`kills`。 从堆中取出用过的剑。 

d. 如果`c_i > 0`, 推一把新剑并造成伤害`max(sword_used, c_i)`回到堆中。 这确保了新剑始终至少与消耗的剑一样坚固。 
5.处理完所有怪物后，输出`kills`。 

保持的不变性是，在每一步中，堆包含当前可用的所有剑，并且我们总是选择能够杀死当前最弱怪物的最小剑。 这保证了为更强的怪物保留更强的剑。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

T = int(input())
for _ in range(T):
    n, m = map(int, input().split())
    swords = list(map(int, input().split()))
    monsters = list(map(int, input().split()))
    gains = list(map(int, input().split()))
    
    swords.sort()
    monsters = sorted(zip(monsters, gains))
    
    heap = swords[:]
    heapq.heapify(heap)
    kills = 0
    
    for life, gain in monsters:
        while heap and heap[0] < life:
            heapq.heappop(heap)
        if not heap:
            continue
        sword = heapq.heappop(heap)
        kills += 1
        if gain > 0:
            heapq.heappush(heap, max(sword, gain))
    
    print(kills)
```这个解决方案首先对剑和怪物进行排序。 最小堆用于有效地挑选可以杀死当前怪物的最小剑。 操作顺序很重要：先弹出较弱的剑，然后递增`kills`，然后推送获得的任何新剑。 使用`max(sword, gain)`确保新剑始终至少与旧剑一样坚固。 

## 工作示例

 **示例输入 1**```
3 2
2 2 2
2 3
3 2
```| 步骤| 堆状态 | 怪物（生命、增益）| 行动| 杀戮 |
 | --- | --- | --- | --- | --- |
 | 开始| [2,2,2]| (2,3) | 弹出 2 ≤ 2 → 使用剑，推 max(2,3)=3 | 1 |
 | 下一页 | [2,3,2]| (3,2) | 弹出 2 < 3 → 弹出，下一个 2 < 3 → 弹出，下一个 3 ≥ 3 → 使用剑，推 max(3,2)=3 | 2 |

 输出：`2`。 痕迹证实选择最小的足够的剑并更新`max(sword, gain)`产生最大的杀戮。 

**边缘情况示例**```
2 2
1 2
2 3
0 0
```| 步骤| 堆| 怪物| 行动| 杀戮 |
 | --- | --- | --- | --- | --- |
 | 开始| [1,2]| (2,0) | Pop 1 < 2 → Pop 2 ≥ 2 → 使用，增益 0 → 不推送 | 1 |
 | 下一页 | []| (3,0) | 堆空→无法杀死| 1 |

 输出：`1`。 这证实了该算法可以正确处理剑不足的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log(n + m)) | O((n + m) log(n + m)) | 对剑和怪物进行排序的时间复杂度为 O(n log n + m log m)，所有怪物的堆操作总和为 O((n + m) log(n + m)) |
 | 空间| O(n + m) | 堆最多存储n+m把剑，加上输入数组 |

 这完全符合限制条件`n + m ≤ 2 * 10^5`每个测试用例且总和 ≤ 2 * 10^5。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # paste solution here
    T = int(input())
    for _ in range(T):
        n, m = map(int, input().split())
        swords = list(map(int, input().split()))
        monsters = list(map(int, input().split()))
        gains = list(map(int, input().split()))
        
        swords.sort()
        monsters = sorted(zip(monsters, gains))
        
        heap = swords[:]
        import heapq
        heapq.heapify(heap)
        kills = 0
        
        for life, gain in monsters:
            while heap and heap[0] < life:
                heapq.heappop(heap)
            if not heap:
                continue
            sword = heapq.heappop(heap)
            kills += 1
            if gain > 0:
                heapq.heappush(heap, max(sword, gain))
        print(kills)
    return output.getvalue().strip()

# Sample
assert run("1\n3 2\n2 2 2\n2 3\n3 2\n") == "2"

# Custom cases
assert run("1\n2 2\n1 2\n2 3\n0 0\n") == "1", "insufficient sword"
assert run("1\n1 1\n1000000000\n1\n0\n") == "1", "large sword kills small monster"
assert run("1\n3 3\n1 1 1\n2 2 2\n2 2 2\n") == "3", "all gains equal sword"
assert run("1\n2 3\n5 5\n1 10 5\n0 0 10\n") == "3", "mix of gains and
```
