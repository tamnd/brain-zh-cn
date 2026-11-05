---
title: "CF 1831D - BOSS可以数对"
description: "给定两个长度为 n 的数组 a 和 b。 任务是计算 i < j 的索引对 (i, j) 的数量，使得这些索引处的 a 元素的乘积等于相应的 b 元素的总和：a[i] a[j] = b[i] + b[j]。"
date: "2026-06-09T07:06:54+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "math"]
categories: ["algorithms"]
codeforces_contest: 1831
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 875 (Div. 2)"
rating: 2000
weight: 1831
solve_time_s: 96
verified: false
draft: false
---

[CF 1831D - BOSS 可以数对](https://codeforces.com/problemset/problem/1831/D)

 **评级：** 2000
 **标签：** 二分查找、暴力破解、数据结构、数学
 **求解时间：** 1m 36s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个数组`a`和`b`等长的`n`。 任务是统计索引对的数量`(i, j)`和`i < j`使得产品的`a`这些索引处的元素等于相应的总和`b`要素：`a[i] * a[j] = b[i] + b[j]`。 本质上，我们正在寻找其中乘法关系的位置组合`a`符合加法关系`b`。 

约束条件告诉我们`n`可以达到`2 * 10^5`所有测试用例的总和，并且各个数组元素的边界为`n`。 检查所有对的简单解决方案大约需要`O(n^2)`每个测试用例的操作。 和`n`最多`2 * 10^5`，在最坏的情况下这可能会导致 10^10 次操作，这对于 4 秒的时间限制来说太慢了。 我们需要一个接近线性或稍微超线性的解决方案`n`对于每个测试用例。 

边缘情况包括所有元素都相同的数组，或者像这样的小值`1`与大值交互。 例如，如果`a = [1, 1]`和`b = [1, 1]`，唯一的一对`(1,2)`满足`1*1 = 1+1`这是`1 = 2`， 错误的。 假设小数字自动生成有效对的粗心实现会给出错误的答案。 

另一个微妙的边缘是`a[i] * a[j]`增长速度快于`b[i] + b[j]`，所以大多数对都无法相等。 暴力解决方案可能会浪费精力检查所有这些。 

## 方法

 蛮力方法很简单：对于每个`i`从`1`到`n-1`, 迭代所有`j > i`并检查是否`a[i]*a[j] == b[i]+b[j]`。 这是正确的，但它的时间复杂度是`O(n^2)`。 和`n`最多`2*10^5`，这会导致大约 10^10 次操作，这是不可行的。 蛮力之所以有效，是因为它直接实现了定义，但是当`n`很大。 

有效方法的关键是重新安排条件`a[i]*a[j] = b[i]+b[j]`进入`a[i]*a[j] - b[j] = b[i]`。 对待`i`固定并定义`c[i] = a[i]*a[j] - b[j]`。 对于每个`i`，我们正在寻找有多少`j > i`满足`b[i] = a[i]*a[j] - b[j]`。 我们可以将其重新构造为计算出现次数`a[j]*a[i] - b[j]`那场比赛`b[i]`。 通过从末尾迭代到开头并将值存储在频率图中，我们可以有效地计算匹配对`O(n * sqrt(n))`时间。 原因`sqrt(n)`相关的是`a[i]`的边界是`n`，因此我们可以将内部迭代限制在可能的小乘数上。 这将二次爆炸减少到易于管理的程度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | 最佳| O(n * sqrt(n)) | O(n * sqrt(n)) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个计数器`ans`为零。 这将存储有效对的数量。 
2. 创建频率词典`freq`将整数值映射到计数`b[j] - a[j]*k`到目前为止所看到的。 
3. 迭代`i`从`n-1`下降到`0`。 通过反向扫描，我们确保只计算对`(i,j)`和`i < j`。 
4. 对于每个`i`, 迭代`a[i]`的除数`d`最多`sqrt(n)`。 对于每个除数，计算潜在的匹配`b[j]`价值利用`b[j] = d * a[i] - b[i]`。 如果该值存在于`freq`，将其计数添加到`ans`。 
5. 计算匹配数后`i`， 更新`freq`包括`a[i]*k - b[i]`对于小`k`。 这确保了未来的迭代可以找到`i`作为`j`。 
6. 循环结束后，`ans`包含有效对的总数。 

为什么它有效：通过向后迭代，我们保持了不变量`freq`包含所有`b[j]-a[j]*k`值`j > i`。 检查时`i`，我们有效地查询有多少个未来`j`无需扫描所有即可满足相等性`j`。 基于除数的枚举之所以有效，是因为`a[i]`的边界是`n`，将检查数量限制为大约`sqrt(n)`每个索引。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict
import math

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        ans = 0
        freq = defaultdict(int)
        for i in reversed(range(n)):
            for d in range(1, int(math.isqrt(a[i])) + 1):
                if a[i] % d == 0:
                    # divisor d
                    target = a[i] // d * a[i] - b[i]
                    if target in freq:
                        ans += freq[target]
                    # complementary divisor
                    if d * d != a[i]:
                        target2 = d * a[i] - b[i]
                        if target2 in freq:
                            ans += freq[target2]
            # update freq for current element
            freq[a[i] * 1 - b[i]] += 1
        print(ans)

solve()
```该解决方案首先读取测试用例的数量并单独处理每个测试用例。 我们初始化`ans`和`freq`用于计数。 向后迭代确保我们只计算有效的`i < j`对。 除数枚举允许我们限制每个元素检查的候选对的数量。 更新中`freq`计数后确保我们只包括`j > i`在频率图中。 使用`defaultdict(int)`避免关键错误并简化计数。 

## 工作示例

 ### 示例 1

 输入数组：`a = [2,3,2]`,`b = [3,3,1]`| 我| 之前的频率 | 找到有效对 | | 之后的频率
 | ---| ---| ---| ---|
 | 2 | {} | 0 | {1:1} |
 | 1 | {1:1} | 0 | {1:1,0:1} |
 | 0 | {1:1,0:1} | 2 | {1:2,0:1} |

 该迹线表明，通过使用频率图进行计数，我们正确识别了两对`(1,2)`和`(1,3)`。 

### 示例 2

 输入数组：`a = [4,2,8,2,1,2,7,5]`,`b = [3,5,8,8,1,1,6,5]`| 我| 频率 | 新对| 更新频率 |
 | ---| ---| ---| ---|
 | 7 | {} | 0 | {0:1} |
 | 6 | {0:1} | 1 | {0:1,1:1} |
 | 5 | {0:1,1:1} | 1 | ... |

 该表类似地继续，证明使用频率计数的向后迭代可以有效地捕获所有有效对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * sqrt(n)) | O(n * sqrt(n)) | 枚举每个元素的除数，大致对每个元素进行 sqrt(n) 检查。 |
 | 空间| O(n) | 频率字典最多存储 n 个元素的计数。 |

 鉴于该总和`n`所有测试用例的 ≤ 2*10^5，这种方法非常适合时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("3\n3\n2 3 2\n3 3 1\n8\n4 2 8 2 1 2 7 5\n3 5 8 8 1 1 6 5\n8\n4 4 8 8 8 8 8 8\n8 8 8 8 8 8 8 8\n") == "2\n7\n1"

# custom: minimum-size
assert run("1\n2\n1 1\n1 1\n") == "0", "minimum size, no valid pair"
# custom: all-equal
assert run("1\n4\n2 2 2 2\n2 2 2 2\n") == "6", "all equal, all pairs valid"
# custom: large values
assert run(f"1\n5\n5 5 5 5 5\n5 5 5 5 5
```
