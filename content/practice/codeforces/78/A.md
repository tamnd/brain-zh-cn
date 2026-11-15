---
title: "CF 78A - 俳句"
description: "我们得到了三行代表一首诗的三个短语。 有效的俳句必须在第一个短语中包含 5 个元音字母，在第二个短语中包含 7 个元音字母，在第三个短语中包含 5 个元音字母。 对于这个问题，音节被简化为元音计数。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 78
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 70 (Div. 2)"
rating: 800
weight: 78
solve_time_s: 210
verified: true
draft: false
---

[CF 78A - 俳句](https://codeforces.com/problemset/problem/78/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 3m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了三行代表一首诗的三个短语。 有效的俳句必须在第一个短语中包含 5 个元音字母，在第二个短语中包含 7 个元音字母，在第三个短语中包含 5 个元音字母。 

对于这个问题，音节被简化为元音计数。 仅小写字母`a`,`e`,`i`,`o`， 和`u`被视为元音。 空格并不重要，单词之间可以用多个空格分隔。 前导和尾随空格也是允许的。 

任务只是计算三行中每一行中的元音，并检查计数是否符合要求`5-7-5`图案。 

限制很小。 每行的长度最多为 100，因此总输入大小最多为 300 个字符。 即使是低效的解决方案也很容易在时间限制内完成。 每个字符串一次通过就足够了。 

主要困难不是性能，而是正确处理格式。 单词之间可以出现多个空格，行首或行尾也可能有空格。 尝试不小心拆分单词的解决方案可能会意外忽略有效字符或错误处理空标记。 

考虑这个输入：```
on  codeforces  
beta round is running
   a rustling of keys
```第一行包含多个空格和尾随空格。 正确的输出是`YES`因为空格不影响元音计数。 

另一个容易犯的错误是忘记只有小写元音才算数。 例如：```
bcdfg
aeiouuu
hello
```元音计数为`0`,`7`， 和`2`，所以答案是`NO`。 

粗心的实现也可能会计算不同的元音而不是总的元音出现次数。 例如：```
aaaaa
aeiouae
eeeee
```计数是`5`,`7`， 和`5`。 每个元音的出现都很重要，而不仅仅是唯一的字母。 

## 方法

 最直接的做法就是逐行处理，统计有多少个字符属于元音集`{a, e, i, o, u}`。 计算完所有三行的计数后，我们将它们与`[5, 7, 5]`。 

即使是强力解释在这里也能正常工作，因为输入非常小。 假设我们分别重复扫描每个字符串中的每个元音。 每行的长度最多为 100，因此仍然只有几百个操作。 

更清晰的观察是我们根本不需要单词边界。 空格是无关紧要的，每个辅音都可以被忽略。 整个问题简化为计算每行中的匹配字符。 

这种洞察力给出了一个非常紧凑的线性解决方案。 我们扫描每一行一次，计算元音，并将结果与​​所需的模式进行比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(5 × n) | O(5 × n) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 这里，`n`是三行的字符总数。 

## 算法演练

 1. 准确读取显示的三个输入行。 
2. 将所需的元音计数存储为`[5, 7, 5]`。 
3. 对于每一行，扫描每个字符并计算有多少个字符属于元音集`{a, e, i, o, u}``。 
4. 将当前行的计数与该位置的预期值进行比较。 

第一行必须有 5 个元音，第二行必须有 7 个，第三行必须有 5 个。 
5. 如果任何行比较失败，则打印`NO`立即地。 
6. 如果所有三行都符合其所需的计数，则打印`YES`。 

### 为什么它有效

 在这个问题中，有效俳句的定义仅取决于每个短语中元音字母的数量。 该算法精确计算这些字符并忽略其他所有内容。 由于每个字符都被检查一次，并且每个元音的出现都对计数贡献恰好 1，因此计算出的总数是正确的。 将这些总数与`5-7-5`直接匹配问题定义，因此算法不能接受无效的诗歌或拒绝有效的诗歌。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# solution

vowels = set("aeiou")
target = [5, 7, 5]

lines = [input().rstrip('\n') for _ in range(3)]

for i in range(3):
    count = 0

    for ch in lines[i]:
        if ch in vowels:
            count += 1

    if count != target[i]:
        print("NO")
        sys.exit()

print("YES")
```解决方案首先将所有元音存储在一个集合中。 集合中的成员检查是恒定时间的，这使实施保持干净和高效。 

这三行完全按照给定的方式读取。 我们只删除尾随的换行符`rstrip('\n')`。 使用普通`strip()`还将删除前导和尾随空格，这是不必要的。 尽管空格不会影响这里的正确性，但保留原始输入格式更安全。 

对于每一行，我们迭代每个字符，并在该字符是元音时增加计数器。 

计算一行元音后，我们立即将结果与所需值进行比较。 如果计数不同，则无需继续检查剩余行，因此我们打印`NO`并提前终止。 

如果所有三行都满足所需的计数，则这首诗符合俳句结构，我们将打印`YES`。 

## 工作示例

 ### 示例 1

 输入：```
on  codeforces  
beta round is running
   a rustling of keys
```| 线路| 文字| 元音计数| 预计 |
 | ---| ---| ---| ---|
 | 1 |`on  codeforces`| 5 | 5 |
 | 2 |`beta round is running`| 7 | 7 |
 | 3 |`a rustling of keys`| 5 | 5 |

 由于所有三个计数均符合所需模式，因此输出为：```
YES
```此示例表明多个空格和前导空格并不重要。 仅计算元音出现次数。 

### 示例 2

 输入：```
hello
aeiouae
world
```| 线路| 文字| 元音计数| 预计 |
 | ---| ---| ---| ---|
 | 1 |`hello`| 2 | 5 |
 | 2 |`aeiouae`| 7 | 7 |
 | 3 |`world`| 1 | 5 |

 第一行已经不符合要求，因此正确的输出是：```
NO
```该痕迹表明，一个不匹配就足以拒绝这首诗。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符被扫描一次 |
 | 空间| O(1) | O(1) | 仅使用少量计数器和小型固定结构|

 最大总输入大小仅为 300 个字符，因此该解决方案基本上可以立即运行。 内存使用量恒定且远低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    vowels = set("aeiou")
    target = [5, 7, 5]

    lines = [input().rstrip('\n') for _ in range(3)]

    for i in range(3):
        count = 0

        for ch in lines[i]:
            if ch in vowels:
                count += 1

        if count != target[i]:
            print("NO")
            return

    print("YES")

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

# provided sample
assert run(
    "on  codeforces  \n"
    "beta round is running\n"
    "   a rustling of keys\n"
) == "YES\n", "sample 1"

# minimum-size invalid case
assert run(
    "a\n"
    "a\n"
    "a\n"
) == "NO\n", "minimum-size case"

# exact 5-7-5 using repeated vowels
assert run(
    "aaaaa\n"
    "aeiouae\n"
    "eeeee\n"
) == "YES\n", "exact vowel counts"

# spaces everywhere
assert run(
    "   aeiou   \n"
    " aeiouae \n"
    "  eeeee\n"
) == "YES\n", "leading and trailing spaces"

# consonants only
assert run(
    "bcdfg\n"
    "hjklmnp\n"
    "qrst\n"
) == "NO\n", "zero vowels"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a / a / a`|`NO`| 最小尺寸无效输入 |
 | 具有精确计数的重复元音 |`YES`| 总发生次数很重要 |
 | 输入有多个空格 |`YES`| 必须忽略空格 |
 | 仅辅音 |`NO`| 零元音处理 |

 ## 边缘情况

 一个常见的棘手情况是单词之间和句子周围有多个空格。 

输入：```
   aeiou   
 aeiouae 
  eeeee
```该算法扫描每个字符。 空格被忽略，因为它们不是元音。 计数变为`5`,`7`， 和`5`，所以输出是：```
YES
```另一个边缘情况是根本没有元音的行。 

输入：```
bcdfg
hjklmnp
qrst
```元音计数为`0`,`0`， 和`0`。 第一行已经未达到所需的计数`5`，所以算法立即打印：```
NO
```一个微妙的错误是计算不同的元音而不是所有出现的元音。 

输入：```
aaaaa
aeiouae
eeeee
```第一行包含同一元音的五个副本。 该算法正确地分别计算每次出现的次数，产生计数`5`,`7`， 和`5`。 输出是：```
YES
```
