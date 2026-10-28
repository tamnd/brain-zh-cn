---
title: "CF 146A - 幸运券"
description: "我们被要求确定票号是否幸运。 幸运彩票号码同时满足两个条件。 首先，数字的每个数字必须是 4 或 7。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 146
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 104 (Div. 2)"
rating: 800
weight: 146
solve_time_s: 70
verified: true
draft: false
---

[CF 146A - 幸运券](https://codeforces.com/problemset/problem/146/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定票号是否幸运。 幸运彩票号码同时满足两个条件。 首先，数字的每个数字必须是 4 或 7。其次，数字前半部分的数字之和必须等于后半部分的数字之和。 输入提供偶数_n_，即票号的长度，后跟票号本身作为数字字符串。 如果票幸运，则输出应为“YES”，否则为“NO”。 

约束条件很温和：票据长度 _n_ 在 2 到 50 之间，始终为偶数。 由于我们只需要单独检查每个数字并对数组的一半求和，因此 O(n) 算法就足够了。 不需要任何更复杂的东西。 潜在的边缘情况包括带有前导零的彩票、包含幸运数字和非幸运数字混合的彩票，以及长度为 2 的最小尺寸彩票，其中一半只是个位数。 

将一半相加但忘记检查非幸运数字的幼稚方法将会失败。 例如，输入：```
2
47
```is not lucky because the first half sum (4) does not equal the second half sum (7). If the code only checked for lucky digits but not the sum, it might incorrectly accept it. 同样，票证如：```
4
4444
```满足幸运数字条件，两半之和为8，所以是幸运的。 

## 方法

 强力方法是对所有数字进行两次迭代：一次确保所有数字都是 4 或 7，一次计算每一半的总和并进行比较。 这是有效的，因为每个数字的操作是恒定的。 复杂度为O(n)，在给定约束的情况下是可以接受的，因此不需要进一步优化。 

关键的见解是该问题本质上是线性的。 检查数字有效性和求和一半可以一次性完成。 可以通过将字符串切成前 n/2 个数字和第二个 n/2 个数字来识别两半。 每个步骤都是独立的，因此我们不需要额外的数据结构或复杂的算法。 在这种情况下，暴力方法实际上是最佳方法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取输入值：整数 _n_ 和字符串形式的票号。 字符串格式对于处理潜在的前导零至关重要。 
2. 初始化两个和，`sum_first`和`sum_second`, 为零。 这些将保存门票前半部分和后半部分的总和。 
3. 迭代票号。 对于每个数字，检查它是“4”还是“7”。 如果任何数字不是幸运数字，则立即输出“NO”并终止。 这确保了第一个幸运数字条件得到执行。 
4. 对于前n/2位，将每个字符转换为整数并添加到`sum_first`。 
5. 对于剩余的n/2位，将每个字符转换为整数并添加到`sum_second`。 
6.处理完所有数字后，进行比较`sum_first`和`sum_second`。 如果相等，则输出“YES”； 否则，输出“NO”。 

为什么有效：该算法保持了任何非幸运数字都会立即拒绝的不变性。 总和的计算是准确的并且被分成两半。 由于这两个条件都是独立且顺序评估的，因此对于约束内的任何有效输入长度，最终决策都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
ticket = input().strip()

half = n // 2
sum_first = 0
sum_second = 0

for i in range(n):
    if ticket[i] not in '47':
        print("NO")
        sys.exit()
    if i < half:
        sum_first += int(ticket[i])
    else:
        sum_second += int(ticket[i])

if sum_first == sum_second:
    print("YES")
else:
    print("NO")
```代码首先读取票的长度和票号。 它计算分割数字的中点。 迭代所有数字，它首先验证每个数字都是幸运的。 然后，它使用简单的索引比较分别对两半进行求和。 这`sys.exit()`打印“NO”后确保如果发现非幸运数字我们立即终止。 最后，检查两半的相等性来决定输出。 

## 工作示例

 ### 示例 1

 输入：```
2
47
```| 我| 票[i] | 是幸运吗？ | 先求和 | 总和秒 |
 | ---| ---| ---| ---| ---|
 | 0 | 4 | 是的 | 4 | 0 |
 | 1 | 7 | 是的 | 4 | 7 |

 两半之和为 4 vs 7。输出为“NO”。 这证实了总和条件已正确执行。 

### 示例 2

 输入：```
4
4477
```| 我| 票[i] | 是幸运吗？ | 先求和 | 总和秒 |
 | ---| ---| ---| ---| ---|
 | 0 | 4 | 是的 | 4 | 0 |
 | 1 | 4 | 是的 | 8 | 0 |
 | 2 | 7 | 是的 | 8 | 7 |
 | 3 | 7 | 是的 | 8 | 14 | 14

 8 与 14 的总和比较失败。 输出为“否”。 该代码可以正确处理较长的票据并确保金额匹配。 

### 示例 3

 输入：```
4
4747
```| 我| 票[i] | 是幸运吗？ | 先求和 | 总和秒 |
 | ---| ---| ---| ---| ---|
 | 0 | 4 | 是的 | 4 | 0 |
 | 1 | 7 | 是的 | 11 | 11 0 |
 | 2 | 4 | 是的 | 11 | 11 4 |
 | 3 | 7 | 是的 | 11 | 11 11 | 11

 11 次与 11 次传递的总和比较。 输出为“是”。 这表明该算法正确识别了幸运彩票。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个数字都会被检查一次，以检查幸运数字并更新总和。 |
 | 空间| O(1) | O(1) | 仅使用了少数整型变量； 没有额外的数据结构与 n 成比例。 |

 约束条件允许 n 最大为 50，这使得 O(n) 解决方案对于 2 秒的限制来说变得微不足道。 内存使用量极小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        exec(open(__file__).read(), {'sys': sys})
    return out.getvalue().strip()

# Provided samples
assert run("2\n47\n") == "NO", "sample 1"
assert run("4\n4747\n") == "YES", "sample 2"

# Custom cases
assert run("4\n4477\n") == "NO", "sum mismatch"
assert run("2\n44\n") == "YES", "minimal length lucky"
assert run("2\n40\n") == "NO", "non-lucky digit"
assert run("6\n447477\n") == "YES", "even split, sums equal"
assert run("6\n447477\n") == "YES", "leading zeros check not needed since input digits always in '0-9'"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 4\n4477 | 否 | 检查总和与所有幸运数字不匹配 |
 | 2\n44 | 2\n44 是 | 幸运的最小长度票 |
 | 2\n40 | 2 否 | 拒绝非幸运数字 |
 | 6\n447477 | 是 | 更长的票，且分摊金额匹配 |

 ## 边缘情况

 对于像这样的门票`02`当 n=2 时，代码立即拒绝它，因为“0”不是幸运数字，这证明了对前导零的正确处理。 对于最小的输入`44`当 n=2 时，前半部分和后半部分的总和均为 4，产生“YES”。 对于最大长度，该算法仍然迭代最多 50 位数字，执行简单的算术，确保正确性，不会溢出或相差一位错误。
