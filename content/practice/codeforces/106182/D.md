---
title: "CF 106182D - 数字除法"
description: "任务是将一串数字分成连续的部分，以便这些部分在解释为整数时形成严格递增的序列。 我们需要创建至少两块，并且数字的顺序不能改变。 如果存在有效的分割，我们输出其中的任何一个。"
date: "2026-06-25T10:51:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106182
codeforces_index: "D"
codeforces_contest_name: "Petrozavodsk Summer Camp 2025. Day 6. Xeppelin Contest The 4rd Universal Cup. Stage 2: Grand Prix of Paris)"
rating: 0
weight: 106182
solve_time_s: 32
verified: true
draft: false
---

[CF 106182D - Digit Division](https://codeforces.com/problemset/problem/106182/D)

 **评级：** -
 **标签：** -
 **求解时间：** 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是将一串数字分成连续的部分，以便这些部分在解释为整数时形成严格递增的序列。 我们需要创建至少两块，并且数字的顺序不能改变。 如果存在有效的分割，我们输出其中的任何一个。 

每个查询给出一个长度和一个数字字符串。 The length can be as large as 300 and there can be up to 300 queries. These limits are small enough that a linear scan per query is easily acceptable. An algorithm with quadratic or cubic string operations would still be unnecessary, because the structure of the problem allows a constant time decision after reading the string.

 The tricky part is not the length of the string, but understanding when a split can fail. A careless solution may try arbitrary split positions or compare the whole string numerically, which is unnecessary and can also create mistakes with long strings.

 例如，考虑：```
2
99
```唯一可能的分裂是`9 | 9`。 这两个数相等，所以答案是：```
NO
```仅检查字符串是否包含多个数字的解决方案可能会错误地接受它。 

Another boundary case is:```
2
12
```唯一的分割是`1 | 2`，并且因为`1 < 2`，正确的输出是任何有效的表示形式，例如：```
YES
2
1 2
```长度大于二的情况表现不同。 例如：```
3
654
```拆分为`6 | 54`之所以有效，是因为由这些数字组成的每两位数字至少为 11，它总是大于一位数。 

## 方法

 直接的方法是尝试每一个可能的位置插入分隔符。 对于每次分割，我们将构建结果数字并检查每个数字是否小于下一个数字。 这是正确的，因为它检查了每一个可能的划分，但最多有`n - 1`分隔符位置和许多要比较的结果片段。 如果约束较大，重复将子字符串转换为数字可能会使实现变得不必要的昂贵。 

关键的观察是第一次分割就足够了。 如果字符串超过两位数字，则将其分为第一个数字和剩余的后缀。 第一部分是个位数，所以它的值最多是9。第二部分至少有两位数，每个数字都是从1到9，所以它的值至少是11。第二部分保证更大。 

这种结构不会自动起作用的唯一情况是当字符串长度恰好为 2 时。 在这种情况下，唯一可能的除法就是两个单独的数字，因此我们只需比较它们即可。 

蛮力之所以有效，是因为它会搜索所有有效的切割。 上面的观察证明几乎每个字符串都有一个明显的有效剪切，从而完全消除了搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 不必要|
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取当前查询的数字串。 字符串的长度决定是否可以使用自动分割。 
2. 如果长度正好为2，则比较第一个数字和第二个数字。 如果第一位数字较小，则拆分为两个个位数部分是有效的。 否则，不存在有效的分割。 
3. 如果长度大于二，则在第一个数字后分割。 结果的两个部分是第一个字符和剩余的后缀。 这总是有效的，因为后缀至少有两位数字，因此代表一个比任何一位数字都大的数字。 
4. 输出构建的除法。 

工作原理：该算法保持了每个生成的相邻零件对都在增加的属性。 对于长度为二的情况，没有替代的划分，因此直接比较决定答案。 对于较长的字符串，第一部分的最大值为 9，而第二部分的最小值为 11，因此所选的分割始终有效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        s = input().strip()

        if n == 2:
            if s[0] < s[1]:
                ans.append("YES")
                ans.append("2")
                ans.append(s[0] + " " + s[1])
            else:
                ans.append("NO")
        else:
            ans.append("YES")
            ans.append("2")
            ans.append(s[0] + " " + s[1:])

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```该代码独立处理每个查询。 特殊情况`n == 2`首先处理，因为一般结构要求第二部分至少包含两位数字。 

对于较长的字符串，表达式`s[1:]`在第一个数字之后创建后缀。 不需要数值转换，这避免了大值的问题并保持解的线性。 

两位数情况下的比较使用字符而不是整数。 由于两个字符都代表单个数字，因此字典比较给出的结果与数字比较的结果完全相同。 

## 工作示例

 ### 示例 1

 输入：```
4
6
654321
4
1337
2
33
4
2122
```对于第一个查询：

 | 步骤| 字符串| 状况 | 行动|
 | ---| ---| ---| ---|
 | 1 | 654321 | 长度大于2 | 在第一个数字后分割 |
 | 2 | 6、54321 | 54321 > 6 | 接受分割 |

 对于第二个查询：

 | 步骤| 字符串| 状况 | 行动|
 | ---| ---| ---| ---|
 | 1 | 1337 | 1337 长度大于2 | 在第一个数字后分割 |
 | 2 | 1, 337 | 337 > 1 | 接受分割 |

 对于第三个查询：

 | 步骤| 字符串| 状况 | 行动|
 | ---| ---| ---| ---|
 | 1 | 33 | 33 长度为 2 | 比较数字 |
 | 2 | 3, 3 | 3 不小于 3 | 拒绝 |

 对于第四个查询：

 | 步骤| 字符串| 状况 | 行动|
 | ---| ---| ---| ---|
 | 1 | 2122 | 2122 长度大于2 | 在第一个数字后分割 |
 | 2 | 2, 122 | 122 > 2 | 接受分割 |

 该跟踪显示了为什么只有两位数字的情况需要真正检查。 较长的字符串可以通过一位数字和多位数字之间的大小差异立即解析。 

### 自定义示例

 输入：```
3
2
12
5
98765
2
98
```| 步骤| 字符串| 状况 | 行动|
 | ---| ---| ---| ---|
 | 1 | 12 | 12 长度为 2 | 比较 1 和 2 |
 | 2 | 1, 2 | 增加| 接受 |
 | 3 | 98765 | 长度大于2 | 分割为 9 和 8765 |
 | 4 | 98 | 98 长度为 2 | 比较 9 和 8 |
 | 5 | 9, 8 | 不增加| 拒绝 |

 此示例练习最小有效拆分、自动长字符串拆分以及失败的两位数情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个数字串被读取一次，读取后只完成恒定量的工作。 |
 | 空间| O(1) | O(1) | 除了输出存储之外，该算法仅使用几个变量。 |

 最大字符串长度很小，但该解决方案也可以自然缩放，因为它从不尝试多个分割位置或执行大型数字运算。 

## 测试用例```python
import sys
import io

def solve_data(data: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(data)
    input = sys.stdin.readline

    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        s = input().strip()

        if n == 2:
            if s[0] < s[1]:
                ans.append("YES")
                ans.append("2")
                ans.append(s[0] + " " + s[1])
            else:
                ans.append("NO")
        else:
            ans.append("YES")
            ans.append("2")
            ans.append(s[0] + " " + s[1:])

    sys.stdin = old_stdin
    return "\n".join(ans)

assert solve_data("""4
6
654321
4
1337
2
33
4
2122
""") == """YES
2
6 54321
YES
2
1 337
NO
YES
2
2 122""", "sample"

assert solve_data("""1
2
12
""") == """YES
2
1 2""", "smallest valid case"

assert solve_data("""1
2
99
""") == "NO", "equal two digits"

assert solve_data("""1
300
""" + "9" * 300 + "\n") == """YES
2
9 """ + "9" * 299, "large length case"

assert solve_data("""1
3
111
""") == """YES
2
1 11""", "all equal digits"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 12`|`YES`| 有效分割的最小长度 |
 |`2 / 99`|`NO`| 相同的数字不能递增 |
 | 长度`300`字符串|`YES`| 大输入处理|
 |`111`|`YES`| 所有数字都等于且长度大于 2 |

 ## 边缘情况

 对于数字相等的两位数字字符串，例如：```
2
55
```算法进入特殊情况并进行比较`5`和`5`。 由于第一个数字不小于，因此它打印`NO`。 这避免了假设每个​​至少有两位数字的字符串可以被分割的常见错误。 

对于第一位数字较小的两位数字字符串，例如：```
2
34
```该算法比较`3`和`4`，找到所需的递增顺序，并输出两个单独的数字。 

对于包含重复大数字的较长字符串，例如：```
5
99999
```该算法不会对整个后缀进行数值比较。 它只是使用`9 | 9999`。 后缀有四位数字，因此其值大于 9。相同的推理适用于每个大于 2 的长度。
