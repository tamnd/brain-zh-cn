---
title: "CF 105677H - SWERC之王"
description: "我们得到了一系列代表选举中选票的名字。 每一行对应一个候选人的一票，每个候选人由一个大写字符串标识。 任务是确定哪位候选人获得的票数严格高于其他候选人。"
date: "2026-06-22T05:07:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105677
codeforces_index: "H"
codeforces_contest_name: "2024-2025 ICPC Southwestern European Regional Contest (SWERC 2024)"
rating: 0
weight: 105677
solve_time_s: 43
verified: true
draft: false
---

[CF 105677H - SWERC之王](https://codeforces.com/problemset/problem/105677/H)

 **评级：** -
 **标签：** -
 **求解时间：** 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一系列代表选举中选票的名字。 每一行对应一个候选人的一票，每个候选人由一个大写字符串标识。 任务是确定哪位候选人获得的票数严格高于其他候选人。 

重要的结构细节是输入保证了唯一的获胜者。 这消除了对关系或次要规则进行推理的需要。 我们只需要识别出现频率最高的名字即可。 

限制很小，最多 500 票，每个名字的长度最多 20。这立即表明，即使是简单的计数策略也能轻松工作。 票数呈线性的解决方案，甚至在最坏的情况下呈二次方的解决方案仍然是可以接受的。 然而，由于输入大小很小，最简洁的方法是使用频率图。 

一个经常让幼稚的实现失败的微妙边缘情况是忘记名称以任意顺序重复并且可能无法分组。 例如，像这样的输入

 乔恩

 乔佛里

 泰温

 乔恩

 需要汇总非相邻位置的计数。 任何仅检查连续重复项的方法都会在这里失败。 另一个潜在的陷阱是假设字典顺序起作用，但这无关紧要，因为投票频率是唯一的决定因素。 

## 方法

 蛮力的想法是将每个名字视为候选者并扫描整个列表以计算它出现的次数。 对于每一次投票，我们都会通过再次迭代所有投票来重新计算其总频率。 这是正确的，因为它直接评估“最频繁”的定义，但它执行了多余的工作。 如果有 N 票，我们对 N 个条目中的每一个执行 O(N) 计数工作，从而导致 O(N²) 操作。 

给定 N ≤ 500，这在数值上仍然很小，但在结构上效率低下且不必要。 关键的观察是频率计数不需要重复扫描。 我们只需要聚合一次计数。 哈希图或字典允许我们在单次传递中累积频率，并在阅读每个投票时更新计数。 之后，我们只需找到最大值即可。 

这将重复工作减少为单个线性遍历，然后对不同名称进行另一次线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N²) | O(1) | O(1) | 已接受但多余 |
 | 频率图 | O(N) | O(K) | 已接受 |

 这里 K 是不同名称的数量。 

## 算法演练

 1. 初始化一个空字典来存储以候选人姓名为关键字的投票计数。 该结构代表了我们在按顺序处理投票时积累的有关选举的知识。 
2. 一一阅读每张选票。 对于每个名称，增加其在字典中的计数。 如果该名称尚不存在，则将其计数初始化为 1。此步骤可确保每张投票都只计算一次。 
3. 维护变量来跟踪当前最佳候选人及其票数。 当我们更新计数时，我们可以在最后重新计算最大值或增量更新它。 最简单且最不易出错的方法是在构建频率表后计算它。 
4. 处理完所有投票后，迭代字典条目并选择出现频率最高的名字。 因为该问题保证了唯一的获胜者，所以我们不需要决胜逻辑。 

### 为什么它有效

在处理过程中的任何时候，字典都会存储迄今为止看到的每个名称的准确出现次数。 由于每张投票都只处理一次，并且只增加一个计数器，因此不会丢失任何信息或重复计算。 处理所有投票后，频率表是数据集的精确表示。 因此，选择该表中的最大值相当于选择原始输入中最常见的名称。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n_line = input().strip()
    if not n_line:
        return
    n = int(n_line)
    
    freq = {}
    
    for _ in range(n):
        name = input().strip()
        freq[name] = freq.get(name, 0) + 1
    
    best_name = ""
    best_count = -1
    
    for name, cnt in freq.items():
        if cnt > best_count:
            best_count = cnt
            best_name = name
    
    print(best_name)

if __name__ == "__main__":
    solve()
```该解决方案使用由字符串作为键控的字典来累积计数。 每个输入行都会被剥离以删除换行符。 这`.get()`方法避免显式的存在检查。 读取所有投票后，我们对字典条目进行最终扫描以找到最大值。 

一个微妙的实现细节是初始化`best_count`到 -1，确保即使是一次投票也能正确更新答案。 

## 工作示例

 ### 示例 1

 输入：```
1
RAMSES
```| 步骤| 投票 | 频率图 | 最佳候选人 |
 | --- | --- | --- | --- |
 | 1 | 拉美西斯 | {拉姆西斯：1} | 拉美西斯 |

 The single vote immediately determines the winner since there are no competing candidates.

 This confirms that the algorithm handles the minimum input size correctly without requiring special casing.

 ### 示例 2

 输入：```
4
JON
JOFFREY
TYWIN
JON
```| 步骤| 投票 | 频率图 | 最佳候选人 |
 | --- | --- | --- | --- |
 | 1 | 乔恩 | {乔恩：1} | 乔恩 |
 | 2 | 乔佛里 | {乔恩：1，乔佛里：1}| JON（并列，首次出现）|
 | 3 | 泰温 | {乔恩：1，乔佛里：1，泰温：1} | 乔恩 |
 | 4 | 乔恩 | {乔恩：2，乔佛里：1，泰温：1} | 乔恩 |

 所有更新后，JON 的频率最高。 

此示例表明，重复的非连续投票被正确聚合，并且中间步骤中的平局不会影响正确性，因为最终选择发生在完全处理之后。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N) | 一次构建频率，一次传递不同的名称 |
 | 空间| O(K) | 存储 K 个唯一名称的数量 |

 约束最多允许 500 票，因此即使字典操作的开销也可以忽略不计。 该解决方案完全符合时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import *
    
    input = _sys.stdin.readline
    
    n = int(input().strip())
    freq = {}
    
    for _ in range(n):
        name = input().strip()
        freq[name] = freq.get(name, 0) + 1
    
    best_name = ""
    best_count = -1
    
    for name, cnt in freq.items():
        if cnt > best_count:
            best_count = cnt
            best_name = name
    
    return best_name + "\n"

# provided samples
assert run("1\nRAMSES\n") == "RAMSES\n"
assert run("4\nJON\nJOFFREY\nTYWIN\nJON\n") == "JON\n"

# custom cases
assert run("3\nA\nB\nA\n") == "A\n"
assert run("5\nZ\nZ\nZ\nY\nX\n") == "Z\n"
assert run("2\nALICE\nBOB\nALICE\n") == "ALICE\n"
assert run("1\nKING\n") == "KING\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 张特大号 | 国王| 最小尺寸输入|
 | 甲乙乙 | 一个 | 基本重复处理 |
 | Z Z Z Y X | Z| 主频案例 |
 | 爱丽丝鲍勃爱丽丝| 爱丽丝| 不相邻的重复项 |

 ## 边缘情况

 一个关键的边缘情况是获胜者出现在不同的位置而不是分组。 例如，在输入中```
3
A
B
A
```字典演变为`{A: 1}`,`{A: 1, B: 1}`,`{A: 2, B: 1}`。 最终的最大值正确地识别了 A，即使它不连续。 任何依赖邻接的方法都会错误地将其视为两个不相关的 A 段。 

另一个边缘情况是最小的可能输入：```
1
KING
```频数表变为`{KING: 1}`立即地。 最大选择步骤仅返回 KING，表明退化情况不需要特殊逻辑。 

最后，所有名称都相同的情况，例如```
4
A
A
A
A
```生成单个字典条目`{A: 4}`。 该算法自然地毫无歧义地处理这个问题，并且最大值在所有步骤中保持一致。
