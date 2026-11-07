---
title: "CF 1940B - 三个阵列"
description: "我们得到三个整数数组。 任务是找到三元组 (i, j, k) 的数量，使得第一个数组的元素 a[i] 小于或等于第二个数组的元素 b[j]，并且第二个数组的元素 b[j] 小于或等于第三个数组的元素......"
date: "2026-06-08T17:48:16+07:00"
tags: ["codeforces", "competitive-programming", "*special", "constructive-algorithms", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1940
codeforces_index: "B"
codeforces_contest_name: "XVIII Open Olympiad in Informatics - Final Stage, Day 2 (Unrated, Online Mirror, IOI rules)"
rating: 0
weight: 1940
solve_time_s: 83
verified: true
draft: false
---

[CF 1940B - 三个阵列](https://codeforces.com/problemset/problem/1940/B)

 **评级：** -
 **标签：** *特殊的、构造性的算法、实现、排序
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到三个整数数组。 任务是找出三胞胎的数量`(i, j, k)`这样第一个数组的元素`a[i]`小于或等于第二个数组的元素`b[j]`，以及第二个数组的元素`b[j]`小于或等于第三个数组的元素`c[k]`。 指数`i`,`j`， 和`k`是独立的； 我们只关心数字关系。 

输入按顺序提供三个数组。 输出是一个整数，即有效三元组的计数。 

约束条件是每个数组最多可以有`10^5`元素，值最多可达`10^9`。 这意味着强力三重嵌套循环，这需要最多`10^15`操作，是不可行的。 任何解决方案在最坏的情况下都必须是接近线性的。 

一个微妙的点是值可以重复。 例如，如果`a = [1, 1]`,`b = [1]`,`c = [1, 1]`，总计数不仅仅是唯一值的数量，而是多重性的乘积：这里是两个`1`进入`a`每对与一个`1`在`b`，还有那个`b`与两个配对`1`进入`c`, 给予`2 * 1 * 2 = 4`有效的三元组。 只计算唯一数字的简单解决方案在这里会失败。 

另一种边缘情况是某些数组为空或包含的元素都大于下一个数组的最小值。 例如，如果`a = [5]`,`b = [3]`,`c = [4]`，不可能有三元组，粗心的解决方案可能会意外计数一些东西。 

## 方法

 强力解决方案是迭代第一个数组中的每个元素，每个元素迭代第二个数组中的所有元素，每个元素迭代第三个数组中的所有元素。 对于每个组合，我们检查是否`a[i] <= b[j] <= c[k]`如果是的话，增加一个计数器。 这可以正常工作，但需要`O(n * m * l)`操作，可以达到`10^15`对于最大尺寸的数组，远远超出了可行的限制。 

优化的关键见解是数组是独立的，但只有它们的相对顺序才重要。 如果我们对数组进行排序，那么对于每个元素`b[j]`在中间数组中，数量`a[i]`令人满意`a[i] <= b[j]`只是元素的数量`a`小于或等于`b[j]`。 同样，数量`c[k]`令人满意`b[j] <= c[k]`是元素的数量`c`大于或等于`b[j]`。 这使我们能够使用二分搜索来有效地计算每个`b[j]`。 

我们将复杂度从三次降低到`O(n log n + m log n + m log l + l log l)`通过第一次排序`a`和`c`，然后迭代`b`并使用`bisect_right`在`a`和`bisect_left`在`c`。 这对于`10^5`元素，因为排序是`O(n log n)`每个二分查找是`O(log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m * l) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n log n + m log n + m log l + l log l) | O(n log n + m log n + m log l + l log l) | O(n + m + l) | O(n + m + l) | 已接受 |

 ## 算法演练

 1. 数组排序`a`按非递减顺序。 这让我们可以通过二分搜索快速计算小于或等于目标的元素。 
2. 数组排序`c`按非递减顺序。 这让我们也可以使用二分搜索快速计算大于或等于目标的元素。 
3. 初始化计数器`total = 0`累积有效的三元组。 
4. 迭代每个元素`b_j`在数组中`b`。 对于每个`b_j`, 求出其中的元素个数`a`那是`<= b_j`。 使用`bisect_right(a, b_j)`，我们准确地得到了这个计数。 
5. 同样，对于每个`b_j`, 求出其中的元素个数`c`那是`>= b_j`。 使用`len(c) - bisect_left(c, b_j)`给出这个计数。 
6. 将步骤 4 和 5 的计数相乘，得到该特定三元组的数量`b_j`并将其添加到`total`。 
7.全部处理完毕后`b_j`，打印总数。 

### 为什么它有效

 对数组进行排序可确保所有小于或等于阈值的元素都是连续的，并且所有大于或等于阈值的元素都是连续的。 使用`bisect_right`和`bisect_left`利用这个属性。 关键的不变量是对于每个`b_j`，我们计算的计数是精确且独立的； 将它们相乘给出满足约束条件的所有组合。 不会遗漏任何三元组，也不会计算无效的三元组，因为二分搜索可确保比较按元素进行。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

def solve():
    n, m, l = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    c = list(map(int, input().split()))

    a.sort()
    c.sort()

    total = 0
    for bj in b:
        count_a = bisect.bisect_right(a, bj)
        count_c = len(c) - bisect.bisect_left(c, bj)
        total += count_a * count_c

    print(total)

if __name__ == "__main__":
    solve()
```该解决方案首先读取数组长度和值。 排序`a`和`c`确保`bisect`通话工作正常。 对于每个`b_j`,`bisect_right(a, bj)`计算所有有效的`a[i]`和`len(c) - bisect_left(c, bj)`计算所有有效的`c[k]`。 将这些计数相乘可得出所有三元组，其中`b_j`是中间的元素。 这`total`计数器累积最终答案。 关键的实施细节是选择`bisect_right`为了`a`和`bisect_left`为了`c`尊重`<=`和`>=`不平等。 

## 工作示例

 **示例输入 1**```
3 2 3
1 3 5
2 3
3 4 6
```| b_j | 计数_a (≤ b_j) | 计数_c (≥ b_j) | b_j 的三胞胎 |
 | --- | --- | --- | --- |
 | 2 | 1 | 3 | 3 |
 | 3 | 2 | 3 | 6 |

 总计 = 9。 

此处，该表显示了每个中间元素如何通过组合左侧和右侧的有效元素计数来贡献多个三元组。 

**示例输入 2**```
2 1 2
1 1
1
1 1
```| b_j | 计数_a | 计数_c | 三胞胎|
 | --- | --- | --- | --- |
 | 1 | 2 | 2 | 4 |

 该算法正确处理重复项。 每个`a[i]`和`c[k]`被独立考虑，给出 4 个三元组，而不是错误地只计算 1 个。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + l log l + m log n + m log l) | O(n log n + l log l + m log n + m log l) | 排序`a`和`c`并对每个进行二分搜索`b_j`|
 | 空间| O(n + m + l) | O(n + m + l) | 输入数组的存储 |

 给定`n, m, l ≤ 10^5`，算法执行大约`10^6`排序和操作`10^5 * log 10^5 ≈ 5*10^5`搜索操作，完全在 2 秒限制之内。 

## 测试用例```python
import sys, io
import bisect

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m, l = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    c = list(map(int, input().split()))

    a.sort()
    c.sort()

    total = 0
    for bj in b:
        count_a = bisect.bisect_right(a, bj)
        count_c = len(c) - bisect.bisect_left(c, bj)
        total += count_a * count_c

    return str(total)

# Provided samples
assert run("3 2 3\n1 3 5\n2 3\n3 4 6\n") == "9", "sample 1"
assert run("2 1 2\n1 1\n1\n1 1\n") == "4", "sample 2"

# Custom test cases
assert run("1 1 1\n1\n1\n1\n") == "1",
```
