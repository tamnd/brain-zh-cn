---
title: "CF 102317B - 音素回文"
description: "正常的回文从两个方向读取都是相同的。 这里，两个不同的字母也可以代表相同的声音。"
date: "2026-08-16T18:44:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102317
codeforces_index: "B"
codeforces_contest_name: "UCF Locals 2016"
rating: 0
weight: 102317
solve_time_s: 179
verified: true
draft: false
---

[CF 102317B - 音素回文](https://codeforces.com/problemset/problem/102317/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 正常的回文从两个方向读取都是相同的。 这里，两个不同的字母也可以代表相同的声音。 例如，如果`c`和`k`被声明为等价的，那么`cak`是一个音素回文，因为它的外部字母，`c`和`k`，声音相同，而中间`a`与自身相匹配。 

输入包含多个独立的测试用例。 对于每个测试用例，我们首先收到一组不相交的小写字母对。 每对都说它的两个字母具有相同的发音。 一个字母最多属于一个这样的对，因此等价关系特别简单。 配对之后，我们收到几个字符串。 对于每个字符串，我们必须判断每个字符是否与另一端对称位置的字符具有相同的声音。 输出必须重现原始字符串，后跟`YES`或者`NO`，用标题和空行分隔测试用例。 

等价对的数量最多为 13 个，最多覆盖 26 个字母。 每个测试字符串的长度最多为 50，一个测试用例中最多有 100 个字符串。 这些限制足够小，即使检查所有 13 对中的每个对称字符对也足够快。 最佳实现可以通过为每个字母分配其声音类别的代表来做得更好，从而将每次比较减少到恒定时间。 

长度为 1 的字符串始终是音素回文。 例如，对于任何一组声音对，输入```
1
1
c k
1
a
```产生```
Test case #1:
a YES
```没有相反的字符可以不同意，因此需要至少一对位置的粗心实现可能会错误地拒绝它。 

当字符不同但等效时，会出现第二种边缘情况。 和`c`和`k`声明等效，字符串`ck`有效：```
1
1
c k
1
ck
```正确的结果是```
Test case #1:
ck YES
```比较原始字符而不是它们的声音会错误地产生`NO`。 

相反的情况也很重要。 和`c`和`k`相等的，`cab`不是音素回文，因为外部字符是`c`和`b`，它们有不同的声音：```
1
1
c k
1
cab
```正确的结果是```
Test case #1:
cab NO
```粗心的实现只检查字符串是否包含已知的等效字母，而不检查相应的位置，可能会错误地接受它。 

## 方法

 直接强力方法存储声音等效对，并针对每个字符串检查从两端到中心的位置。 当两个字符相等时，该对立即有效。 当它们不同时，我们扫描所有声明的声音对，看看这两个字符是否构成其中一对。 如果没有匹配对，则该字符串不是音素回文。 这是正确的，因为当每个对称位置对具有相同的声音时，字符串就是音素回文。 

在最坏的情况下，一个测试用例包含 100 个长度为 50 的字符串。每个字符串最多有 25 次对称位置比较，每次不成功的比较可能会检查所有 13 个声音对。 这最多给出`100 * 25 * 13 = 32,500`一对检查一个测试用例。 这在给定的范围内很小，因此蛮力方法实际上足够快。 

更干净的解决方案来自于注意到整个测试用例的声音关系是固定的。 不要重复搜索配对列表，而是为每个字母分配一个规范代表。 如果`c`和`k`听起来相同，两者都可以映射到`c`。 没有合作伙伴的信件会映射到它们自己。 那么当两个字母的代表相等时，它们的发音完全相同。 

这将每个对称比较转变为恒定时间数组查找。 该算法仍然对每个字符串扫描一次，但最多 13 对的内部搜索消失了。 关键的观察是声音信息是静态的，因此我们应该对其进行一次预处理，而不是在每次字符比较时重新发现它。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q·L·p) | O(p) | 在给定限制下接受 |
 | 最佳 | O(q·L + p) | O(26) | 已接受 |

 这里`q`是字符串的数量，`L`是最大字符串长度，并且`p`是声音等效对的数量。 

## 算法演练

 1. 读取测试用例的数量并独立处理每个测试用例。 一个测试用例的良好关系不得影响任何后续测试用例。 
2. 为所有 26 个小写字母创建映射，最初将每个字母映射到其自身。 这代表了默认规则，即字母听起来总是像它本身。 
3. 对于每个声明的对`(a, b)`，为两个字母分配相同的代表。 由于没有字母出现在超过一对中，我们可以简单地选择`a`作为代表并设置两者`a`和`b`到`a`。 
4. 读取每个字符串并使用索引对称比较其字符`left`和`right`。 从第一个和最后一个字符开始，并将两个索引向中心移动。 
5. 对于每个对称对，比较`representative[s[left]]`和`representative[s[right]]`。 如果它们不同，则两个字符的发音不同，因此整个字符串立即失败。 
6. 如果所有对称对都有相同的代表，则打印原始字符串，然后打印`YES`。 如果发现不匹配，则打印原始字符串，然后打印`NO`。 

### 为什么它有效

 不变量是，当两个字母具有相同的发音时，它们具有相同的代表。 最初，每个字母都代表它自己，并且对于每个声明的等效对，这两个字母都被分配相同的代表。 因为每个字母最多属于一对，所以不会发生冲突的分配。 

对于字符串中的每个对称位置对，算法检查这些代表的相等性。 相等意味着两个字符听起来相同，而不平等意味着它们不同。 音素回文是通过在每个对称对上具有相同的声音来精确定义的，因此当所有此类比较成功时准确接受是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    output = []

    for case_no in range(1, t + 1):
        p = int(input())

        representative = list(range(26))

        for _ in range(p):
            a, b = input().split()
            x = ord(a) - ord('a')
            y = ord(b) - ord('a')

            representative[y] = x
            representative[x] = x

        q = int(input())

        output.append(f"Test case #{case_no}:")

        for _ in range(q):
            s = input().strip()

            left = 0
            right = len(s) - 1
            ok = True

            while left < right:
                x = representative[ord(s[left]) - ord('a')]
                y = representative[ord(s[right]) - ord('a')]

                if x != y:
                    ok = False
                    break

                left += 1
                right -= 1

            output.append(f"{s} {'YES' if ok else 'NO'}")

        output.append("")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```这`representative`数组有 26 个条目，每个小写字母对应一个条目。 保留整数索引而不是字符串使得声音比较成为简单的数组查找。 

当一对诸如`c k`被读取，`c`成为两个字母的代表。 之间的比较`c`和`k`因此成为相同整数之间的比较，因此即使字符本身不同，它也会成功。 

两指针循环只需要检查字符串的前半部分。 一次`left >= right`，每个对称对都已经被检查过。 对于奇数长度的字符串，中间的字符永远不会与任何内容进行比较，这是正确的，因为单个字符总是与自身匹配。 

代码在第一个不匹配处停止，因为后面的位置无法修复失败的对称对。 原始字符串保持不变，因此所需的输出可以准确地再现它。 

输出累积在一个列表中并在最后写入一次。 这避免了重复写入，也使得在每个测试用例之后放置所需的空行变得简单。 

## 工作示例

 官方示例输入包含两个测试用例。 

### 示例 1```
1
1
c k
6
a
cac
ck
cab
kaak
ckckkcck
```映射是`c -> c`,`k -> c`，并且所有其他字母都映射到其自身。 

为了`cac`，外部字符均表示为`c`，中间的字符无关紧要。 

| 字符串| 左| 对| 左声音| 正确的声音| 结果 |
 | ---| ---| ---| ---| ---| ---|
 |`a`| 0 | 0 | | | 是 |
 |`cac`| 0 | 2 | c | c | 继续 |
 |`cac`| 1 | 1 | | | 是 |
 |`ck`| 0 | 1 | c | c | 是 |
 |`cab`| 0 | 2 | c | 乙| 否 |
 |`kaak`| 0 | 3 | c | c | 继续 |
 |`kaak`| 1 | 2 | 一个 | 一个 | 是 |
 |`ckckkcck`| 0 | 7 | c | c | 继续 |
 |`ckckkcck`| 1 | 6 | c | c | 继续 |
 |`ckckkcck`| 2 | 5 | c | c | 继续 |
 |`ckckkcck`| 3 | 4 | c | c | 继续 |
 |`ckckkcck`| 4 | 3 | | | 是 |

 结果输出是：```
Test case #1:
a YES
cac YES
ck YES
cab NO
kaak YES
ckckkcck YES
```该跟踪说明了为什么原始字符相等是不够的。 在`ck`，人物不同，但代表人物是平等的。 

### 示例 2```
1
2
a z
x s
5
abbbz
asxz
cx
sxxabzxss
ks
```这里`a`和`z`共享一个代表，就像`x`和`s`。 

| 字符串| 对称对| 左声音| 正确的声音| 结果 |
 | ---| ---| ---| ---| ---|
 |`abbbz`|`a`,`z`| 一个 | 一个 | 继续 |
 |`abbbz`|`b`,`b`| 乙| 乙| 是 |
 |`asxz`|`a`,`z`| 一个 | 一个 | 继续 |
 |`asxz`|`s`,`x`| x| x| 是 |
 |`cx`|`c`,`x`| c | x| 否 |
 |`sxxabzxss`|`s`,`s`| x| x| 继续 |
 |`sxxabzxss`|`x`,`s`| x| x| 继续 |
 |`sxxabzxss`|`x`,`x`| x| x| 继续 |
 |`sxxabzxss`|`a`,`z`| 一个 | 一个 | 继续 |
 |`sxxabzxss`|`b`,`b`| 乙| 乙| 是 |
 |`ks`|`k`,`s`| k | x| 否 |

 结果输出是：```
Test case #1:
abbbz YES
asxz YES
cx NO
sxxabzxss YES
ks NO
```此示例练习了等价对的两个方向。 代表性映射使得`x`和`s`无需搜索原始配对列表即可互换。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(p + q·L) | O(p + q · L) | 构建映射需要 O(p)，并且在 O(L) 时间内从两端扫描每个字符串 |
 | 空间| O(26) | 除了输出缓冲区 | 之外，声音映射还包含每个小写字母的一个条目。 

和`p <= 13`,`q <= 100`， 和`L <= 50`，实际工作量很小。 即使是强力解决方案，在最大的单个测试用例中也仅执行 32,500 个声音对检查，而代表性映射将其进一步减少到最多 2,500 个对称字符比较。 该解决方案完全符合竞赛问题报告的 1 秒和 256 MB 限制。 

## 测试用例

 竞赛材料中给出了官方样品。```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline
    t = int(input())
    output = []

    for case_no in range(1, t + 1):
        p = int(input())
        representative = list(range(26))

        for _ in range(p):
            a, b = input().split()
            x = ord(a) - ord('a')
            y = ord(b) - ord('a')
            representative[y] = x
            representative[x] = x

        q = int(input())
        output.append(f"Test case #{case_no}:")

        for _ in range(q):
            s = input().strip()
            left, right = 0, len(s) - 1
            ok = True

            while left < right:
                if representative[ord(s[left]) - 97] != representative[ord(s[right]) - 97]:
                    ok = False
                    break
                left += 1
                right -= 1

            output.append(f"{s} {'YES' if ok else 'NO'}")

        output.append("")

    return "\n".join(output)

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        return solve()
    finally:
        sys.stdin = old_stdin
        input = old_input

# provided sample 1
sample1 = """1
1
c k
6
a
cac
ck
cab
kaak
ckckkcck
"""

expected1 = """Test case #1:
a YES
cac YES
ck YES
cab NO
kaak YES
ckckkcck YES
"""

assert run(sample1) == expected1, "sample 1"

# provided sample 2
sample2 = """1
2
a z
x s
5
abbbz
asxz
cx
sxxabzxss
ks
"""

expected2 = """Test case #1:
abbbz YES
asxz YES
cx NO
sxxabzxss YES
ks NO
"""

assert run(sample2) == expected2, "sample 2"

# Minimum-size input, a single character.
assert run("""1
1
a b
1
z
""") == """Test case #1:
z YES
""", "single-character string"

# All characters are equivalent in the only declared pair.
assert run("""1
1
a z
4
az
za
aaaa
azaa
""") == """Test case #1:
az YES
za YES
aaaa YES
azaa YES
""", "equivalent outer characters"

# Boundary case where the first comparison fails immediately.
assert run("""1
1
c k
3
cab
babc
kc
""") == """Test case #1:
cab NO
babc NO
kc YES
""", "early mismatch and equivalent pair"

# Maximum-size string and all-equal values.
large = "a" * 50
assert run(f"""1
1
b c
1
{large}
""") == f"""Test case #1:
{large} YES
""", "length 50 all-equal string"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单字符`z`|`z YES`| 最小字符串长度和`left < right`边界|
 |`az`,`za`,`aaaa`,`azaa`和`a z`等效| 全部`YES`| 不同字母同音、全等字符 |
 |`cab`,`babc`,`kc`和`c k`等效|`NO`,`NO`,`YES`| 直接不匹配和等效边界字符 |
 | 50份`a`|`YES`| 最大字符串长度和重复相同字符 |

 ## 边缘情况

 对于单字符字符串，循环不会执行，因为`left == right`。 该算法立即接受该字符串。 例如，```
1
1
c k
1
a
```产生`a YES`。 这正是音素级别的回文定义，因为只有一种声音可以比较。 

对于不同但等效的字符，代表性映射无需特殊逻辑即可处理这种情况。 和```
1
1
c k
1
ck
```映射包含`representative[c] = c`和`representative[k] = c`。 因此唯一的比较是`c == c`，所以输出是`ck YES`。 

对于真正的不匹配，算法一旦发现就会停止。 和```
1
1
c k
1
cab
```第一个比较是在`c`和`b`。 他们的代表是`c`和`b`，所以算法设置`ok`假和打印`cab NO`。 它不需要检查中间字符。 

对于偶数长度的字符串，每个字符都属于对称对。 和```
1
1
c k
1
kaak
```第一个比较是`k`反对`k`，代表为`c`反对`c`，第二个是`a`反对`a`。 两者都成功了，给予`kaak YES`。 

对于奇数长度的字符串，中心字符没有可能使回文无效的对应字符。 在`cac`，外层`c`字符匹配，中间`a`从来没有比较过。 算法正确返回`cac YES`。 

最后，声音对是独立的。 和`a z`和`x s`，之间的比较`a`和`z`成功，同时比较`a`和`x`失败。 映射精确地编码了这些独立关系，因此角色不会意外继承不相关对的声音。
