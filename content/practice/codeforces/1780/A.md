---
title: "CF 1780A - 隼人和学校"
description: "我们被要求在一个整数数组中找到三个总和为奇数的不同元素。 输入由多个测试用例组成，每个测试用例提供数组。 输出必须指示这样的三元组是否存在，如果存在，则提供任何有效的三个索引集。"
date: "2026-06-09T11:23:37+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1780
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 846 (Div. 2)"
rating: 800
weight: 1780
solve_time_s: 128
verified: false
draft: false
---

[CF 1780A - 隼人和学校](https://codeforces.com/problemset/problem/1780/A)

 **评分：** 800
 **标签：** 构造性算法，贪心
 **求解时间：** 2m 8s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在一个整数数组中找到三个总和为奇数的不同元素。 输入由多个测试用例组成，每个测试用例提供数组。 输出必须指示这样的三元组是否存在，如果存在，则提供任何有效的三个索引集。 

关键属性是，如果一个整数不能被 2 整除，则该整数是奇数。因此，如果三个数字的和正好包含一个奇数和两个偶数，或者三个数字都是奇数，则该三个数字的和是奇数。 这一观察立即将问题简化为计算奇数和偶数，而不是测试所有可能的三元组。 

限制是中等的：每个数组最多可以有 300 个元素，但所有测试用例的总数不超过 200,000。 强力三重枚举需要检查$\binom{300}{3} \approx 4.5 \times 10^6$每个测试用例的总和。 这对于单个测试用例是可行的，但对于 10,000 个测试用例来说是不可行的，因此我们需要一种更聪明的方法。 此外，边缘情况包括仅包含偶数的数组、少于三个奇数的数组或包含混合数组（其中仔细选择索引很重要）。 

例如，如果数组是 [2, 4, 6, 1]，则简单测试前三个元素的简单方法可能会失败。 选择前三个给出偶数总和，但存在有效的三元组，包括最后一个元素。 因此，算法必须根据奇偶校验有选择地选择索引。 

## 方法

 蛮力方法迭代所有索引三元组$(i, j, k)$，对元素求和，并检查总和是否为奇数。 这保证了正确性，因为它考虑了每种可能性。 缺点是在最坏的情况下$n = 300$和 10,000 个测试用例，这会导致数十亿次操作，这太慢了。 

最佳方法是使用奇偶校验。 计算奇数和偶数的索引。 如果至少有三个奇数，选择任意三个都会得到奇数和。 否则，如果存在至少一个奇数和至少两个偶数，则选择一个奇数和两个偶数也给出奇数和。 如果两个条件都不成立，则不存在有效的三元组。 这将问题简化为简单的线性扫描和条件逻辑，完全避免了嵌套循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个测试用例 O(n³) | O(1) | O(1) | 对于大输入来说太慢 |
 | 最优（基于奇偶校验）| 每个测试用例 O(n) | 用于存储索引的 O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取元素数量$n$和数组$a$。 
2. 初始化两个列表：`odd_indices`和`even_indices`存储奇数和偶数的位置。 
3. 使用从 1 开始的索引迭代数组。 如果元素是奇数，则将其索引附加到`odd_indices`。 如果偶数，则追加到`even_indices`。 
4.检查长度`odd_indices`。 如果至少有三个元素，则打印“YES”和前三个索引`odd_indices`。 
5. 否则，检查是否`odd_indices`至少有一个元素并且`even_indices`至少有两个元素。 如果是，则打印“YES”、第一个奇数索引和前两个偶数索引。 
6. 如果两个条件都不满足，则打印“NO”。 

不变的是这些条件涵盖了从三个数字形成奇数和的所有情况。 三个奇数之和总是奇数。 一个奇数和两个偶数相加也为奇数。 任何其他组合要么产生偶数总和，要么无法形成三个不同的索引。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    
    odd_indices = []
    even_indices = []
    
    for i, num in enumerate(a, 1):
        if num % 2 == 0:
            even_indices.append(i)
        else:
            odd_indices.append(i)
    
    if len(odd_indices) >= 3:
        print("YES")
        print(odd_indices[0], odd_indices[1], odd_indices[2])
    elif len(odd_indices) >= 1 and len(even_indices) >= 2:
        print("YES")
        print(odd_indices[0], even_indices[0], even_indices[1])
    else:
        print("NO")
```该代码首先按奇偶校验分隔索引，然后应用所讨论的逻辑。 使用从 1 开始的索引可以避免差一错误。 条件的顺序确保算法在混合情况之前优先选择三个奇数。 枚举与`start=1`将数组位置与所需的输出格式对齐。 

## 工作示例

 ### 输入示例 1```
3
1 1 1
1 1 2 2
1 2 3
```| 步骤| 奇数索引 | 偶数索引 | 输出|
 | --- | --- | --- | --- |
 | 测试1 | [1,2,3]| []| 是 1 2 3 |
 | 测试2 | [1, 2] | [3, 4] | 是 1 3 4 |
 | 测试3 | [1, 3] | [2] | 否 |

 该轨迹表明该算法正确地选择了三个奇数或一个奇数和两个偶数。 当两者都不可用时，输出“NO”。 

### 输入示例 2```
5
2 4 6 1
2 2 2
1 3 5
```| 步骤| 奇数索引 | 偶数索引 | 输出|
 | --- | --- | --- | --- |
 | 测试1 | [4] | [1,2,3]| 是 4 1 2 |
 | 测试2 | []| [1,2,3]| 否 |
 | 测试3 | [1,2,3]| []| 是 1 2 3 |

 这说明了边缘处理：单个奇数和两个偶数生成有效的三元组，而全偶数数组则失败。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 线性扫描分离索引就足够了； 随后进行恒定时间检查。 |
 | 空间| O(n) | 存储奇数和偶数的索引最多需要 n 个位置。 |

 鉴于所有的总和$n$不超过 200,000，总操作完全在典型的 1 秒限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        odd_indices = []
        even_indices = []
        for i, num in enumerate(a, 1):
            if num % 2 == 0:
                even_indices.append(i)
            else:
                odd_indices.append(i)
        if len(odd_indices) >= 3:
            print("YES")
            print(odd_indices[0], odd_indices[1], odd_indices[2])
        elif len(odd_indices) >= 1 and len(even_indices) >= 2:
            print("YES")
            print(odd_indices[0], even_indices[0], even_indices[1])
        else:
            print("NO")
    return output.getvalue().strip()

# provided samples
assert run("6\n3\n1 1 1\n4\n1 1 2 2\n3\n1 2 3\n5\n1 4 5 1 2\n4\n2 6 2 4\n5\n5 6 3 2 1\n") == "YES\n1 2 3\nYES\n1 3 4\nNO\nYES\n1 3 4\nNO\nYES\n1 3 5"

# custom cases
assert run("1\n3\n2 4 6\n") == "NO", "all even"
assert run("1\n3\n1 3 5\n") == "YES\n1 2 3", "all odd"
assert run("1\n4\n1 2 4 6\n") == "YES\n1 2 3", "one odd, enough evens"
assert run("1\n5\n2 2 2 1 3\n") == "YES\n4 1 2", "two odd, enough evens"
assert run("1\n3\n1 2 2\n") == "YES\n1 2 3", "one odd, two evens"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 4 6 | 否 | 所有偶数都失败 |
 | 1 3 5 | 1 3 5 是 1 2 3 | 所有奇数都成功 |
 | 1 2 4 6 | 1 2 4 6 是 1 2 3 | 混合、一个奇数、足够的偶数|
 | 2 2 2 1 3 | 2 2 2 1 3 是 4 1 2 | 混合，两个奇数，足够的偶数|
 | 1 2 2 | 1 2 2 是 1 2 3 | 最小尺寸，一个奇数，两个偶数 |

 ## 边缘情况

 仅包含偶数的数组，例如
