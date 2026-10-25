---
title: "CF 130G - 大写锁定打开"
description: "我们得到一个包含可打印 ASCII 字符的字符串。 有些字符可能是小写英文字母，有些可能已经是大写字母，还有一些可能是符号或数字。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 130
codeforces_index: "G"
codeforces_contest_name: "Unknown Language Round 4"
rating: 1700
weight: 130
solve_time_s: 88
verified: true
draft: false
---

[CF 130G - 大写锁定打开](https://codeforces.com/problemset/problem/130/G)

 **评分：** 1700
 **标签：** *特别
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个包含可打印 ASCII 字符的字符串。 有些字符可能是小写英文字母，有些可能已经是大写字母，还有一些可能是符号或数字。 任务是仅将小写字母转换为大写版本，同时保持其他所有字符不变。 

例如，字符串`cOdEfOrCeS`变成`CODEFORCES`。 小写字母`c`,`d`,`f`,`r`， 和`e`被转换，而已经是大写的字符保持完全相同。 

输入的长度最多为100个字符，非常小。 即使是低效的解决方案也能轻松满足限制。 对字符串进行线性扫描就足够了，因为处理 100 个字符基本上不需要时间。 内存使用量也很小，因为我们只需要存储结果字符串。 

棘手的部分不是性能而是正确性。 粗心的实现可能会意外修改非小写字母的字符。 

考虑这个输入：```
abc123!?
```正确的输出是：```
ABC123!?
```数字和标点符号必须保持不变。 盲目地将每个字符代码移动固定量的实现会破坏非字母字符。 

另一个边缘情况是已经是大写的字符串：```
HELLO
```输出必须保持：```
HELLO
```假设每个字母都是小写的有缺陷的实现可能会错误地将大写字符转换为不相关的 ASCII 符号。 

一种更重要的情况是混合符号：```
a-z_
```正确的输出是：```
A-Z_
```仅小写字母`a`和`z`应该改变。 破折号和下划线必须保持不变。 

## 方法

 最直接的暴力方法就是逐个检查每个字符。 对于每个字符，我们检查它是否是小写英文字母。 如果是，我们将其替换为对应的大写字母。 否则，我们将其原封不动地复制到结果中。 

这已经可以有效地工作，因为字符串长度最多为 100。最坏的情况仅执行 100 个字符检查和转换，这是可以忽略不计的。 

手动实现这种暴力方法的一种方法是通过 ASCII 算术。 小写字母`'a'`通过`'z'`恰好是大写字母之后的 32 个位置`'A'`通过`'Z'`在 ASCII 表中。 因此，如果一个字符位于小写范围内，我们可以从它的 ASCII 值中减去 32。 

该语言已经通过内置提供了更干净的解决方案`upper()`方法。 该方法内部执行相同的转换逻辑并保持非字母字符不变。 由于问题只要求大写转换，因此使用内置方法给出了最简单、最安全的实现。 

在这里，暴力破解的想法和最佳解决方案实际上是相同的，因为输入很小，并且每种有效的方法都会扫描字符串一次。 主要改进不是渐进速度而是代码简单性和可靠性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 手动字符转换| O(n) | O(n) | 已接受 |
 | 使用内置`upper()`| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 从标准输入读取输入字符串。 
2. 使用Python将字符串转换为大写`upper()`方法。 

此方法将每个小写英文字母转换为大写版本，同时保持数字、标点符号和已经大写的字母不变。 
3. 打印转换后的字符串。 

### 为什么它有效

 该算法独立处理每个字符。 对于每个字符，大写转换遵循标准 ASCII 字母映射规则。 小写字母将转换为大写字母，而所有其他字符保持不变。 由于每个位置都被正确且独立地处理，因此最终的字符串正是输入所需的大写转换。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# solution
s = input().strip()
print(s.upper())
```该程序首先从输入中读取字符串。 由于输入由一行组成，`strip()`安全地删除标准输入添加的尾随换行符。 

致电给`upper()`执行整个转换。 Python 自动将小写英文字母转换为大写字母，并保持所有其他可打印 ASCII 字符不变。 这种行为完全符合问题的要求。 

该实现避免了手动 ASCII 操作，从而减少了涉及标点符号或已经大写字母的错误的可能性。 

## 工作示例

 ### 示例 1

 输入：```
cOdEfOrCeS
```| 位置 | 人物 | 后`upper()`|
 | ---| ---| ---|
 | 0 | c | C |
 | 1 | 哦| 哦|
 | 2 | d | d |
 | 3 | 电子| 电子|
 | 4 | f | F |
 | 5 | 哦| 哦|
 | 6 | r | 右 |
 | 7 | C | C |
 | 8 | 电子| 电子|
 | 9 | S | S |

 最终输出：```
CODEFORCES
```此示例显示小写和大写字母可以以任何顺序出现。 该算法独立处理每个字符并仅转换小写字符。 

### 示例 2

 输入：```
a-z_123
```| 位置 | 人物 | 后`upper()`|
 | ---| ---| ---|
 | 0 | 一个 | 一个 |
 | 1 | - | - |
 | 2 | z | Z|
 | 3 | _ | _ |
 | 4 | 1 | 1 |
 | 5 | 2 | 2 |
 | 6 | 3 | 3 |

 最终输出：```
A-Z_123
```该迹线确认符号和数字保持不变。 仅修改小写字母。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 字符串被扫描一次 |
 | 空间| O(n) | 创建一个新的大写字符串 |

 这里，`n`是字符串的长度。 由于最大长度仅为 100，因此该解决方案很容易满足时间和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    s = input().strip()
    print(s.upper())

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided samples
assert run("cOdEfOrCeS\n") == "CODEFORCES\n", "sample 1"

# custom cases
assert run("a\n") == "A\n", "single lowercase letter"
assert run("Z\n") == "Z\n", "single uppercase letter"
assert run("123!@#\n") == "123!@#\n", "symbols and digits unchanged"
assert run("abcxyz\n") == "ABCXYZ\n", "all lowercase letters"
assert run("a-z_123\n") == "A-Z_123\n", "mixed symbols and letters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a`|`A`| 最小尺寸小写输入 |
 |`Z`|`Z`| 已经大写的字符保持不变 |
 |`123!@#`|`123!@#`| 数字和符号被保留 |
 |`abcxyz`|`ABCXYZ`| 所有小写​​字母都能正确转换 |
 |`a-z_123`|`A-Z_123`| 安全处理混合字符 |

 ## 边缘情况

 考虑输入：```
123!@#
```该算法适用`upper()`到整个字符串。 由于所有字符都不是小写字母，因此每个字符都保持不变。 输出变为：```
123!@#
```此案例证实标点符号和数字已正确保留。 

现在考虑：```
HELLO
```每个字符都已经是大写的。 转换使字符串保持不变，产生：```
HELLO
```这验证了算法不会意外修改大写字母。 

最后，考虑：```
a-z_
```该算法在内部对字符进行一一处理：

 | 人物 | 结果 |
 | ---| ---|
 | 一个 | 一个 |
 | - | - |
 | z | Z|
 | _ | _ |

 最终输出是：```
A-Z_
```这表明即使小写字母被非字母符号包围，也能正确转换。
