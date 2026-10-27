---
title: "CF 1364A - XXXXX"
description: "我们得到一个整数数组和一个 Ehab 不喜欢的数字 $x$。 目标是找到最长连续子数组的长度，其总和不能被 $x$ 整除。 每个测试用例都会给出一个新数组和一个新的 $x$。"
date: "2026-06-11T12:23:36+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "number-theory", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1364
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 649 (Div. 2)"
rating: 1200
weight: 1364
solve_time_s: 114
verified: true
draft: false
---

[CF 1364A - XXXXX](https://codeforces.com/problemset/problem/1364/A)

 **评分：** 1200
 **标签：** 暴力破解、数据结构、数论、两个指针
 **求解时间：** 1m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一个数字$x$埃哈布不喜欢的。 目标是找到最长连续子数组的长度，其总和不能被整除$x$。 每个测试用例给出一个新的数组和一个新的$x$。 如果没有子数组满足条件，则输出应为$-1$。 

输入数组最多可达$10^5$元素长，以及数组中的值和$x$可以达到$10^4$。 每次运行最多 5 个测试用例，这意味着我们的解决方案在最坏情况下必须是线性的$n$每个测试用例，因为检查所有子数组的朴素二次方法将大致涉及$5 \times 10^5 \times 10^5 / 2$最坏情况下的操作，对于 1 秒的时间限制来说太慢了。 

微妙的边缘情况包括数组，其中所有元素都是以下的倍数$x$。 例如，对于$a = [2, 4, 6]$和$x = 2$，任何子数组的和都可以被 2 整除，所以输出应该是$-1$。 另一种边缘情况是整个数组的总和已经不能被整除$x$; 在这种情况下，最长的子数组就是整个数组。 具有零或单个元素等于的数组$x$也可能表现不同，需要小心处理以避免出现相差一的错误。 

## 方法

 暴力方法将显式检查所有子数组，计算它们的总和，并通过以下方式测试可整性：$x$。 这在逻辑上是可行的，但是子数组的数量是$O(n^2)$，计算每个总和需要$O(1)$带前缀和。 总运营量仍为$O(n^2)$，这对于$n = 10^5$。 

关键的见解是可分性的属性是全局的。 如果整个数组的和不能被整除$x$，那么完整数组就已经是答案了。 如果总和可以除以$x$，那么我们必须删除至少一个元素才能打破这种整除性。 因为子数组必须保持连续，所以删除前缀或后缀，直到第一个元素不能被整除$x$达到给出最长可能的子数组。 我们不需要检查所有子数组； 我们只需要不能被整除的第一个和最后一个元素$x$。 这一观察结果将解从二次时间缩短为线性时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 对于每个测试用例，请阅读$n$和$x$然后读取数组$a$。 
2. 计算数组的总和。 如果这个总和不能被整除$x$，立即返回$n$，数组的完整长度。 
3. 如果总和可以除以$x$，从左侧扫描数组，找到第一个不能被整除的元素$x$。 将其索引存储为`left`。 
4. 从右边开始扫描数组，找到第一个不能被整除的元素$x$。 将其索引存储为`right`。 
5. 如果不存在这样的元素，则所有元素都可以被整除$x$并且子数组的和不能被整除$x$; 返回$-1$。 
6. 否则，计算两个候选子数组长度：删除前缀`left`产量`n - left - 1`，并删除后缀`right`产量`right`。 答案是这两个长度中的最大值。 

这里的不变量是从数组的一端删除总和可被整除的元素$x$直到到达不可整除的元素，保证剩余子数组的总和不能被整除$x$。 这是最长的可能，因为删除更多元素只会不必要地缩短子数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, x = map(int, input().split())
    a = list(map(int, input().split()))
    
    total = sum(a)
    if total % x != 0:
        print(n)
        continue
    
    left = 0
    while left < n and a[left] % x == 0:
        left += 1
    right = n - 1
    while right >= 0 and a[right] % x == 0:
        right -= 1
    
    if left == n:  # all elements divisible by x
        print(-1)
    else:
        print(max(n - left - 1, right))
```实现直接遵循算法。 我们首先处理全数组的情况。 左右扫描是简单的线性扫描，在第一个不可整除的元素处停止。 最大值计算考虑了最长子数组的两个选项。 边界条件，例如所有元素可被整除$x$，通过单独的检查明确处理。 

## 工作示例

 跟踪示例 1：

 输入：`3 3` `1 2 3`- 总和 = 6，可被 3 整除。 
- 向左扫描：索引 0 处的第一个元素 1 % 3 != 0。 
- 向右扫描：索引 1 处的最后一个元素 3 % 3 == 0，倒数第二个 2 % 3 != 0。 
- 候选长度：`n - left - 1 = 3 - 0 - 1 = 2`,`right = 1`。 最大值 = 2。 

输入：`3 4` `1 2 3`- 总和 = 6，不能被 4 整除。 
- 答案 = 3，完整数组长度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个数组最多扫描两次，一次从左到右，一次从右到左。 |
 | 空间| O(1) | O(1) | 仅存储少数索引和总和。 |

 对于给定的约束，即使在最大输入大小的情况下，这也能保证在 1 秒内完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution code inline
    t = int(input())
    for _ in range(t):
        n, x = map(int, input().split())
        a = list(map(int, input().split()))
        
        total = sum(a)
        if total % x != 0:
            print(n)
            continue
        
        left = 0
        while left < n and a[left] % x == 0:
            left += 1
        right = n - 1
        while right >= 0 and a[right] % x == 0:
            right -= 1
        
        if left == n:
            print(-1)
        else:
            print(max(n - left - 1, right))
    return output.getvalue().strip()

# provided samples
assert run("3\n3 3\n1 2 3\n3 4\n1 2 3\n2 2\n0 6\n") == "2\n3\n-1", "sample 1"

# custom cases
assert run("1\n1 1\n1\n") == "-1", "single element divisible by x"
assert run("1\n1 2\n1\n") == "1", "single element not divisible by x"
assert run("1\n5 2\n2 4 6 8 10\n") == "-1", "all even, x = 2"
assert run("1\n5 3\n3 3 3 3 1\n") == "5", "last element breaks divisibility"
assert run("1\n6 5\n5 5 5 5 5 1\n") == "6", "last element not divisible by x"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 1 | 1 1 1 -1 | 单个元素可被 x 整除 |
 | 1 2 1 | 1 2 1 1 | 不能被 x 整除的单个元素 |
 | 5 2 2 4 6 8 10 | 5 2 2 4 6 8 10 -1 | 所有可被 x 整除的元素 |
 | 5 3 3 3 3 3 1 | 5 3 3 3 3 3 1 5 | 最后一个元素打破了整除性 |
 | 6 5 5 5 5 5 5 1 | 6 5 5 5 5 5 5 1 6 | 最后一个元素不能被 x 整除 |

 ## 边缘情况

 当所有元素都可以被整除时$x$，该算法通过以下方式正确识别了这一点`left == n`查看。 对于只有一个元素不能被整除的数组$x$，算法计算`n - left - 1`和`right`正确地选择满足条件的最大连续子数组。 对于总和已经不可整除的数组，该算法避免不必要的扫描并返回完整的数组长度。
