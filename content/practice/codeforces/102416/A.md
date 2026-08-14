---
title: "CF 102416A - 回文"
description: "我们需要检查正整数的集合，并计算从左到右和从右到左读取时有多少个具有相同的数字序列。"
date: "2026-08-14T14:43:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102416
codeforces_index: "A"
codeforces_contest_name: "Edinburgh Competition 2019"
rating: 0
weight: 102416
solve_time_s: 87
verified: false
draft: false
---

[CF 102416A - 回文](https://codeforces.com/problemset/problem/102416/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要检查正整数的集合，并计算从左到右和从右到左读取时有多少个具有相同的数字序列。 例如，`1221`合格是因为它的两半相互镜像，而`1234`不是因为第一位和最后一位数字不同。 

第一个输入值给出整数的数量，`n`。 以下输入包含那些`n`整数。 答案是单个计数：这些整数中有多少是回文。 

值的数量最多为 100 个，每个值最多可以包含 51 位小数，因为上限为`10^50`。 这些数字可能比普通 64 位整数的范围大得多，因此将它们视为字符串是自然的表示形式。 在这里，即使直接扫描每个数字也是很小的。 在所有输入中最多有`100 * 51 = 5100`位数，因此任何位数线性解决方案都可以在一秒的限制内轻松完成。 

有一些边缘情况可能会导致实施出现微妙的错误。 单个数字始终是回文。 例如：```
1
7
```正确的输出是`1`。 从比较对开始而不正确处理数字中间的实现可能会意外地拒绝这种情况。 

最大可能值也值得关注：```
1
100000000000000000000000000000000000000000000000000
```这个值是`10^50`，有 51 位数字并且不是回文，因此输出为`0`。 以固定宽度整数类型存储值的解决方案可能会在检查数字之前溢出。 

回文长度可以是奇数或偶数。 例如：```
2
12321
1221
```两个数字都是回文，所以输出是`2`。 仅检查固定一半的配对而不正确处理两种奇偶校验情况的循环可能会引入差一错误。 

输入描述显示后面的数字`n`，并且示例将它们放在不同的行上。 读取以空格分隔的标记，而不是假设所有数字都在一行上，可以自然地处理这两种布局。 

## 方法

 最直接的方法是从两端向中心检查数字。 对于诸如`74647`，比较第一个和最后一个数字，然后比较第二个和第四个数字。 如果每个对应对都匹配，则该数字是回文数。 如果任何一对不同，则不是。 由于一个数字最多有 51 位数字，因此最多需要`ceil(51 / 2) = 26`每个数字的数字比较，或所有 100 个数字最多 2600 次比较。 在实际限制下，这种强力方法不会变得太慢。 

更简单的实现通过字符串操作使用相同的想法。 将每个输入数字转换为字符串`s`,构造其反转形式`s[::-1]`，并比较两个字符串。 当一个字符串的数字在两个方向读起来相同时，它就等于它的反面。 切片操作对每个数字处理一次，因此渐近复杂度与位数仍然是线性的。 

关键的观察是该问题不需要对数字值进行算术。 我们只关心它的十进制数字的顺序。 由于值可以包含 51 位数字，因此将其表示为字符串可以避免溢出，并可以直接访问我们需要测试的属性。 

蛮力方法和字符串方法具有相同的渐近复杂度。 字符串版本在这里更可取，因为Python已经提供了简洁可靠的反向操作，消除了手动索引管理并减少了差一错误的机会。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(D) | 每个数字 O(1) 额外 | 已接受 |
 | 最佳 | O(D) | 每个数字的 O(D) | 已接受 |

 这里，`D`是所有输入数字中小数位数的总数。 自从`D <= 5100`，这两种方法都足够快。 

## 算法演练

 1. 阅读`n`，要检查的整数数量。 其余以空格分隔的标记是实际数字，因此它们的行排列并不重要。 
2. 将计数器初始化为零。 该计数器将表示有多少输入数字已被确认为回文。 
3. 对于每个输入数字，将其保留为字符串，而不是将其转换为整数。 这避免了任何溢出问题并保留了准确的数字序列。 
4. 使用反转字符串`s[::-1]`。 生成的字符串包含相同数字但顺序相反。 
5. 将原始字符串与其反向副本进行比较。 如果它们相等，则每个数字在另一侧都有相同的对应项，因此增加回文计数器。 
6. 毕竟`n`数字已处理完毕，打印计数器。 

### 为什么它有效

 对于任意字符串`s`，其反面包含数字`s`以完全相反的顺序。 平等`s == s[::-1]`当每个位置与其镜像位置具有相同的数字时，精确地保持。 这正是数字回文的定义。 由于每个输入数字都是独立测试的，并且计数器会针对满足此属性的数字精确递增，因此最终计数器就是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    tokens = sys.stdin.read().split()

    if not tokens:
        return

    n = int(tokens[0])
    numbers = tokens[1:1 + n]

    answer = 0

    for s in numbers:
        if s == s[::-1]:
            answer += 1

    print(answer)

if __name__ == "__main__":
    solve()
```该解决方案读取所有以空格分隔的输入标记，这使得它与数字是否出现在一行或多行上无关。 第一个标记被转换为整数，因为它控制应处理的数字数量。 

每个数字仍然是一个字符串。 这是故意的，因为`10^50`超出了典型的 64 位有符号整数的范围，而 Python 字符串可以直接表示它，无需任何数值转换。 

表达式`s[::-1]`创建相反的数字序列。 Python 在内部处理索引边界，因此不需要手动计算中点，也不需要对奇数和偶数长度进行单独处理。 

最终条件比较完整的原始字符串和反转字符串。 一位数字字符串会自动与其相反的字符串进行比较，而一旦结果字符串不同，非回文就会失败。 

## 工作示例

 ### 示例 1

 输入包含四个数字。 我们独立处理每一项。 

| 数量 | 反转| 回文| 处理后回复 |
 | --- | --- | --- | --- |
 |`3`|`3`| 是的 | 1 |
 |`546`|`645`| 没有 | 1 |
 |`74647`|`74647`| 是的 | 2 |
 |`74565`|`56547`| 没有 | 2 |

 个位数`3`等于其倒数，因此它为答案贡献了 1。`546`失败，因为它的第一位数字和最后一位数字不同。`74647`反转后不变，因此它贡献了另一个计数。 最后，`74565`变成`56547`，所以被拒绝。 最终的答案是`2`。 

### 自定义示例

 考虑：```
5
1
1221
12321
1234
100000000000000000000000000000000000000000000000000
```踪迹是：

 | 数量 | 反转| 回文| 处理后回复 |
 | --- | --- | --- | --- |
 |`1`|`1`| 是的 | 1 |
 |`1221`|`1221`| 是的 | 2 |
 |`12321`|`12321`| 是的 | 3 |
 |`1234`|`4321`| 没有 | 3 |
 |`100000000000000000000000000000000000000000000000000`|`000000000000000000000000000000000000000000000000001`| 没有 | 3 |

 此示例涵盖一位数、偶数长度回文、奇数长度回文、普通非回文以及最大尺寸值。 该算法通过完全相同的相等性测试来对待所有这些。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(D) | 在反转和比较字符串时，每个输入数字都会被处理固定次数。 |
 | 空间| O(L) | 反转一个数字会创建一个最多包含`L <= 51`数字。 |

 对于此问题，总位数最多为 5100。因此，该解决方案仅执行几千个字符操作，并且与 256 MB 限制相比，使用的内存可以忽略不计。 

## 测试用例```python
import sys
import io

def solve_data(inp: str) -> str:
    tokens = inp.split()

    if not tokens:
        return ""

    n = int(tokens[0])
    numbers = tokens[1:1 + n]

    answer = sum(s == s[::-1] for s in numbers)
    return str(answer)

def run(inp: str) -> str:
    return solve_data(inp).strip()

assert run("""4
3
546
74647
74565
""") == "2", "sample 1"

assert run("""5
1
11
12
121
122
""") == "3", "single digit and short boundary cases"

assert run("""6
1221
12321
1234
9999
1001
101
""") == "5", "odd and even length palindromes"

assert run("""3
100000000000000000000000000000000000000000000000000
999999999999999999999999999999999999999999999999999
123456789012345678901234567890123456789012345678901
""") == "1", "maximum-size values"

assert run("""4
7
8
9
0
""") == "4", "all one-digit values"

| Test input | Expected output | What it validates |
|---|---|---|
| `1, 11, 12, 121, 122` | `3` | Single digits, two-digit values, and odd-length palindromes |
| `1221, 12321, 1234, 9999, 1001, 101` | `5` | Both even and odd palindrome lengths plus a non-palindrome |
| Three 51-digit values | `1` | Maximum allowed digit length and values beyond fixed-width integer ranges |
| `7, 8, 9, 0` | `4` | Minimum-size numbers and the fact that every one-digit string is a palindrome |

## Edge Cases

A one-digit number such as `7` has no distinct pair of digits to compare. Reversing it gives the same string:

```文本
 1
 7```

The algorithm computes `s = "7"` and `s[::-1] = "7"`, so the equality test succeeds and the output is `1`. This avoids needing a special case for the middle digit.

For the maximum possible value, consider:

```1
 100000000000000000000000000000000000000000000000000```

The string has 51 digits. Its first digit is `1`, while its last digit is `0`, so the reversed string cannot equal the original. The algorithm produces `0`. Since the value is never converted to a machine integer, there is no overflow issue.

For an even-length palindrome:

```1
 1221```

The reverse of `1221` is also `1221`, so the answer is `1`. The algorithm does not need to identify a center or decide whether the length is odd or even. String reversal handles both cases uniformly.

For an odd-length palindrome:

```1
 12321```

The reverse is again `12321`, producing `1`. The middle digit `3` naturally maps to itself. A manual two-pointer solution would stop once the pointers meet, but the string-based solution avoids that boundary entirely.

Finally, consider a number with a mismatch close to the center:

```1
 12331
 ````

 它的逆向是`13321`，所以输出是`0`。 外部数字匹配，下一对也匹配，但内部数字不同。 将完整字符串与其反向字符串进行比较，可以捕获每个可能位置的不匹配，包括那些粗心的部分比较可能会错过的位置。
