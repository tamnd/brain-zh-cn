---
title: "CF 102222C - 凯撒密码"
description: "我们得到两个长度相同的字符串，其中第一个字符串是已知的明文，第二个字符串是凯撒加密版本。 凯撒密码对每个大写字母应用一个固定的循环移位。"
date: "2026-08-17T22:02:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102222
codeforces_index: "C"
codeforces_contest_name: "2018-2019 ACM-ICPC, China Multi-Provincial Collegiate Programming Contest"
rating: 0
weight: 102222
solve_time_s: 84
verified: true
draft: false
---

[CF 102222C - 凯撒密码](https://codeforces.com/problemset/problem/102222/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到两个长度相同的字符串，其中第一个字符串是已知的明文，第二个字符串是凯撒加密版本。 凯撒密码对每个大写字母应用一个固定的循环移位。 使用相同的移位来加密第三个字符串，我们的任务是恢复第三个字符串的明文。 

例如，如果`A`变成`D`，平移是`3`， 所以`B`变成`E`,`Y`变成`B`， 和`Z`变成`C`。 一旦知道了移位，解密另一个密文只需要将每个字符向后移动该量。 

每个测试用例给出`n`，已知明文和密文的长度，以及`m`，我们需要解密的密文的长度。 两者最多都是`50`，并且最多可以有`50`测试用例。 这些限制非常小。 即使是检查所有内容的方法`26`可能的凯撒移动和扫描琴弦的速度非常快，最多大约`26 * 50 * 50 = 65,000`所有测试用例的字符比较。 直接解决方案仍然是优选的，因为可以立即从一对相应的字符恢复移位。 

主要的边缘情况来自字母表的循环性质。 转变可以从`Z`回到`A`，因此没有模运算的普通整数减法会产生无效的字符代码。 零移位也是有效的，这意味着明文和密文可以相同。 最后，`n`可以是`1`，因此移位必须可以从单个字符恢复。 

例如，单字符测试用例可以是：```
1
1 1
Z
A
A
```已知的对告诉我们加密移位是`1`，所以最后的`A`解密为`Z`。 正确的输出是：```
Case #1: Z
```计算的粗心实现`ord('A') - 1`直接而不是绕模`26`可以在之前产生一个字符`A`，这不是有效的大写字母。 

零偏移示例是：```
1
1 3
A
A
ABC
```正确的输出是`Case #1: ABC`。 假设密文必须与明文不同的实现会错误地搜索非零移位。 

环绕式案例特别有用：```
1
2 3
YZ
ZA
ABC
```这里已知的对使用了移位`1`， 因为`Y -> Z`和`Z -> A`。 解密`ABC`给出`ZAB`。 忘记模运算将使从`A`向后一位会产生无效结果。 

## 方法

 一种简单的方法是尝试每一种`26`可能的凯撒转变。 对于每个候选移位，加密已知的明文并将结果与​​已知的密文进行比较。 保证只有一位候选人匹配。 找到后，对第三个字符串应用逆移位。 

这种蛮力是正确的，因为每个凯撒密码都是由一个值完全描述的`0`通过`25`。 检查每一个可能的值，不会错过实际的加密规则。 对于一个测试用例，这需要`O(26n + 26m)`时间，简单来说就是`O(n + m)`因为`26`是一个常数。 具有最大值`n = m = 50`, 最多有`2,600`每个测试用例的字符操作，或大约`130,000`跨越所有`50`案例。 在规定的限制下，暴力方法实际上并不算太慢。 

更直接的方法来自于观察凯撒移位已经编码在任何一对相应的字符中。 假设明文开头为`A`密文开头为`T`。 转变是立即的`19`。 更一般地，如果它们的字母索引是`p`和`c`，则加密移位为`(c - p) mod 26`。 因为输入保证了有效且明确的凯撒变换，所以这种变换足以解密第三个字符串中的每个字符。 

暴力法之所以有效，是因为只有`26`可能的转换，但它执行不必要的搜索。 通过观察到一对对齐的字符对决定了移位，我们可以用一次减法来代替搜索，然后对目标密文进行一次线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(26(n + m)) = O(n + m)`|`O(m)`| 已接受 |
 | 直接推导移位|`O(n + m)`|`O(m)`| 已接受 |

 直接法具有较好的常数因子，使问题的结构更加明确。 

## 算法演练

 1. 阅读`n`,`m`，已知的明文，已知的密文，以及必须解密的密文。 前两个字符串具有相应的位置，因为它们具有相同的长度。 
2. 将明文和密文的第一个字符转换为字母索引`0`到`25`。 将加密偏移计算为`(cipher_index - plain_index) % 26`。 一对对应就足够了，因为凯撒密码在任何地方都使用完全相同的移位。 
3. 对于目标密文中的每个字符，将其转换为字母索引并减去恢复的移位。 申请`% 26`以便之前移动`A`环绕到`Z`。 
4. 将每个结果索引转换回大写字母并连接字符。 结果前面加上前缀`Case #x:`使用当前的测试用例编号。 

为什么它有效：让加密转变为`s`。 对于已知对中的每个位置，密文索引等于明文索引加上`s`模数`26`。 因此`(cipher_index - plain_index) % 26`完全恢复`s`。 对于具有加密索引的目标密文字符`c`，其明文索引必须是`(c - s) % 26`，因此算法生成的每个字符正是生成密文的字符。 由于相同的移位适用于每个位置，因此独立解密字符会给出完整正确的明文。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    answers = []

    for case in range(1, t + 1):
        n, m = map(int, input().split())
        plain = input().strip()
        cipher = input().strip()
        target = input().strip()

        plain_index = ord(plain[0]) - ord('A')
        cipher_index = ord(cipher[0]) - ord('A')

        shift = (cipher_index - plain_index) % 26

        decoded = []
        for ch in target:
            value = (ord(ch) - ord('A') - shift) % 26
            decoded.append(chr(value + ord('A')))

        answers.append(f"Case #{case}: {''.join(decoded)}")

    sys.stdout.write('\n'.join(answers))

if __name__ == "__main__":
    solve()
```第一个字符对决定`shift`。 从密文索引中减去明文索引即可得出明文移动的位置数。`% 26`统一处理正负差异。 

解密循环执行相反的操作。 如果加密是`plain + shift`，解密为`cipher - shift`。 Python 的模运算在这里特别方便，因为负结果如`-1 % 26`变成`25`，对应于`Z`。 

无需检查已知明文和密文的剩余字符，因为该问题保证它们是由一次一致的凯撒移位产生的。 检查它们只会重复第一对已经确定的信息。 

结果累积在列表中并在末尾连接一次，而不是重复连接字符串。 对于微小的约束来说，这不是必需的，但它给出了标准的线性时间构造，并避免了不必要的中间字符串。 

Python 中不可能出现整数溢出，唯一需要注意的边界运算是取模`26`当解密跨越`A`到`Z`。 

## 工作示例

 该声明提供了一个示例测试用例：```
1
7 7
ACMICPC
CEOKERE
PKPIZKC
```第一个对应的字符是`A`和`C`，给出一个转变`2`。 Applying that inverse shift to every character of`PKPIZKC`给出`NINGXIA`。 

| 朴实的性格| 密码字符 | 普通索引 | 密码索引 | 班次|
 | --- | --- | --- | --- | --- |
 |`A`|`C`| 0 | 2 | 2 |

 然后目标的解密按如下方式进行。 

| 目标人物| 目标指数|`(index - shift) % 26`| 朴实的性格|
 | --- | --- | --- | --- |
 |`P`| 15 | 15 13 |`N`|
 |`K`| 10 | 10 8 |`I`|
 |`P`| 15 | 15 13 |`N`|
 |`I`| 8 | 6 |`G`|
 |`Z`| 25 | 25 23 | 23`X`|
 |`K`| 10 | 10 8 |`I`|
 |`C`| 2 | 0 |`A`|

 最终的答案是`Case #1: NINGXIA`。 该表演示了核心不变量：每个目标字符向后移动完全相同的恢复量。 

对于第二个例子，考虑转变`25`，相当于加密过程中每个字母向后移动一位。```
1
2 5
YZ
ZA
ABCDE
```这对`Y -> Z`给予转变`1`， 尽管`Z -> A`证实了循环行为。 The target is therefore decrypted by shifting each character backward by`1`。 

| 目标人物| 目标指数|`(index - shift) % 26`| 朴实的性格|
 | --- | --- | --- | --- |
 |`A`| 0 | 25 | 25`Z`|
 |`B`| 1 | 0 |`A`|
 |`C`| 2 | 1 |`B`|
 |`D`| 3 | 2 |`C`|
 |`E`| 4 | 3 |`D`|

 结果是`Case #1: ZABCD`。 这条轨迹练习了字母表边界，因为解密`A`需要环绕到`Z`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n + m)`| 位移在恒定时间内恢复，然后`m`目标字符被处理一次。 |
 | 空间|`O(m)`| 解码后的字符在产生输出之前被存储。 |

 和`n, m <= 50`并且至多`50`在测试用例中，算法每个用例仅执行几千个字符操作。 实施情况远远低于给定的`10`第二个限制并且使用的内存可以忽略不计。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline
    t = int(input())
    answers = []

    for case in range(1, t + 1):
        n, m = map(int, input().split())
        plain = input().strip()
        cipher = input().strip()
        target = input().strip()

        shift = (
            ord(cipher[0]) - ord('A')
            - (ord(plain[0]) - ord('A'))
        ) % 26

        decoded = []
        for ch in target:
            value = (ord(ch) - ord('A') - shift) % 26
            decoded.append(chr(value + ord('A')))

        answers.append(f"Case #{case}: {''.join(decoded)}")

    sys.stdout.write('\n'.join(answers))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """1
7 7
ACMICPC
CEOKERE
PKPIZKC
"""
) == "Case #1: NINGXIA\n", "provided sample"

# Minimum size, zero shift
assert run(
    """1
1 1
A
A
A
"""
) == "Case #1: A\n", "minimum size and zero shift"

# Wraparound from Z to A
assert run(
    """1
2 3
YZ
ZA
ABC
"""
) == "Case #1: ZAB\n", "alphabet wraparound"

# Maximum sizes, shift 25
assert run(
    """1
50 50
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
"""
) == "Case #1: BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB\n", "maximum size"

# Multiple test cases and a nontrivial shift
assert run(
    """2
3 4
ABC
DEF
DEFG
5 6
HELLO
KHOOR
KHOORZ
"""
) == "Case #1: BCDE\nCase #2: HELLOA\n", "multiple cases"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / A / A / A`|`Case #1: A`| 最小尺寸和零位移 |
 |`YZ / ZA / ABC`|`Case #1: ZAB`| 环绕于`A`和`Z`|
 | 50`A`字符，50`Z`角色，目标 50`A`人物 | 50`B`人物 | 最大允许长度和边界偏移 |
 | 两个独立的测试用例 |`Case #1: BCDE`,`Case #2: HELLOA`| 正确的案例编号和独立处理 |

 ## 边缘情况

 单字符情况的处理无需任何特殊分支。 用于输入```
1
1 1
Z
A
A
```指数是`25`和`0`，所以平移是`(0 - 25) % 26 = 1`。 目标`A`有索引`0`， 和`(0 - 1) % 26 = 25`, 给予`Z`。 输出是`Case #1: Z`。 假设必须至少有两个位置的解决方案将会不必要地失败。 

对于零移，请考虑```
1
1 3
A
A
ABC
```恢复的位移是`(0 - 0) % 26 = 0`。 每个目标角色保持不变，产生`Case #1: ABC`。 模表达式还使零移表现自然，无需单独的条件。 

对于字母环绕，请考虑```
1
2 3
YZ
ZA
ABC
```第一对给出了移位`1`，第二对确认移位从`Z`到`A`。 解密过程中，`A`变成`(0 - 1) % 26 = 25`，所以就变成了`Z`。 完整的结果是`Case #1: ZAB`。 这捕获了无需模运算即可执行减法的实现。 

对于最大大小的情况，该算法在恢复移位后仍然对目标字符串仅使用一次传递。 即使与`m = 50`，解码后的列表仅包含`50`字符，并处理所有`50`测试用例最多需要`2,500`目标字符。 小限制使性能变得简单，而相同的推理对于更大的字符串仍然有效。
