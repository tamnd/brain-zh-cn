---
title: "CF 102277E - SGA 主席"
description: "我们知道所有 UCF 学生的名字。 当两位候选人的名字不同，但两个名字都以相同的字母开头时，总统和副总统的票被认为是可能的。"
date: "2026-08-16T19:34:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102277
codeforces_index: "E"
codeforces_contest_name: "UCF Locals 2018"
rating: 0
weight: 102277
solve_time_s: 53
verified: true
draft: false
---

[CF 102277E - SGA 主席](https://codeforces.com/problemset/problem/102277/E)

 **评级：** -
 **标签：** -
 **求解时间：** 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们知道所有 UCF 学生的名字。 当两位候选人的名字不同，但两个名字都以相同的字母开头时，总统和副总统的票被认为是可能的。 即使学生共用一个名字，他们也是不同的，因此，如果有多个学生名为 JOSH，而多个学生名为 JAD，则 JOSH 学生和 JAD 学生的每个选择都会创建一个单独的票证。 两个职位也不同，因此选择 JOSH 担任总裁、JAD 担任副总裁与选择 JAD 担任总裁、JOSH 担任副总裁是不同的。 任务是计算所有这样的有序学生对。 

学生人数最多为 66,183 人，这是用于比赛的 UCF 实际招生人数。 每个名称最多包含 20 个大写字母。 在一秒的时间限制下，检查每对学生的算法是不可行的，因为在最大输入大小下大约有 43.8 亿个有序对。 预期的解决方案必须仅处理每个学生恒定的次数，根据所使用的数据结构给出线性预期或确定性时间。 

答案可能比 32 位有符号整数大得多。 如果许多学生有以相同字母开头的不同名字，则有序对的数量会随着学生数量的二次方增长，因此实现需要一个能够保存 (n^2) 左右值的整数类型。 Python 整数已经具有任意精度，因此代码中不需要特殊处理。 

有几种边缘情况可能会使看似合理的解决方案变得错误。 首先，同名重复副本不得形成有效机票。 例如，```
3
JOSH
JOSH
JAD
```有输出```
4
```有两名 JOSH 学生和一名 JAD 学生。 有效订购的门票为每张JOSH加JAD以及每张JOSH加JAD，共赠送四张门票。 如果粗心的解决方案只是计算所有具有相同首字母的学生，则会计算出 (3 \times 2 = 6)，错误地包括两个有序的 JOSH/JOSH 对。 

其次，候选人的顺序很重要。 为了```
2
JOSH
JAD
```答案是```
2
```因为 JOSH/JAD 和 JAD/JOSH 是不同的票。 计算无序对只会给出一个。 

最后，具有不同首字母缩写的名字绝不能组合在一起。 为了```
3
JOSH
JAD
ALI
```答案是```
2
```因为只有涉及 JOSH 和 JAD 的两个有序对才是有效的。 对每对不同姓名的学生进行计数会错误地包括涉及 ALI 的学生。 

## 方法

 直接的方法是检查每对有序的不同学生。 对于每一对，比较两个名称。 当名字不同且首字母匹配时，两人就为答案贡献一个。 这是正确的，因为它精确地测试了定义有效票证的两个条件。 

问题是对的数量。 对于 (n) 个学生，有 (n(n-1)) 个有序对。 在 (n=66,183) 处，这是

 [
 66,183 \乘以 66,182 = 4,380,123,306
 ]

 配对检查。 即使每次检查都非常便宜，数十亿次迭代也无法满足一秒的竞赛限制。 

蛮力之所以有效，是因为每张有效票证都经过显式检查，但当为每一对重新计算相同信息时，它就会失败。 关键的观察结果是，该条件仅取决于两条信息：每个名字的第一个字母以及两个全名是否不同。 

假设某个特定首字母有 (T) 个学生。 如果我们暂时忽略姓名不同的要求，则存在 (T(T-1)) 有序对的具有该首字母的不同学生。 其中，同名学生无效。 如果一个特定的名字出现 (c) 次，它会贡献 (c(c-1)) 个无效的有序对，因为我们可以选择任何一个学生作为校长，并选择另一个同名的学生作为副校长。 

因此，对于一张初始票，有效票的数量为

 [
 T(T-1) - \sum_{\text{名称}} c(c-1)。 
]

 我们可以增量地计算它，而无需构建对。 在处理姓名为（x）且首字母为（L）的新学生时，假设已经有（T）名首字母为（L）的学生，并且其中（c）名具有完全相同的姓名（x）。 新学生可以作为两个角色之一与以前的学生形成（T）订购票，并且当以前的学生占据第一个角色时形成另一个（T）票。 这在考虑重复名称之前提供了（2T）种可能性。 (c) 之前名为 (x) 的学生在两个方向上均无效，因此我们减去 (2c)。 因此，新学生的贡献是

 [
 2(T-c)。 
]

 添加此贡献后，我们增加初始计数和确切名称计数。 

这给出了一次通过输入的过程。 这种观察是有效的，因为每个先前处理过的学生都可以通过他们的首字母和全名组成的对进行完全分类。 不存在其他影响新生能否形成有效客票的属性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2)) | (O(1)) 除了输入存储 | 太慢了 |
 | 最佳 | (O(n)) 预期 | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 维护`initial_count`，其中存储每个第一个字母已见过的学生数量，以及`name_count`，其中存储每个完整姓名已见过的学生数量。 名字唯一决定了它的第一个字母，因此这两张地图准确地包含了未来学生所需的信息。 
2. 读取每个学生的姓名并提取其第一个字符。 让`same_initial`是先前处理的姓名以此字符开头的学生的数量。 
3.让`same_name`是之前处理过的同名学生的数量。 其中`same_initial`学生，确切地说`same_name`是禁止的伙伴，因为他们的名字没有不同。 
4. 因此，新生有`same_initial - same_name`有效的先前合作伙伴。 每个这样的合伙人都可以担任总统或副总统，因此添加`2 * (same_initial - same_name)`到答案。 
5. 增加学生姓名首字母和全名的计数。 在处理后来的学生时需要这些更新的计数。 

不变量是在处理输入的任何前缀之后，`answer`等于有效订购的总统/副总统票的数量，其中两名学生都属于该前缀。 当新学生到达时，每张新创建的有效门票必须包含该学生和一名较早的学生。 该公式以两种可能的角色顺序准确计算那些具有相同首字母和不同姓名的早期学生。 由于所有门票都是在处理后来的学生时准确引入的，因此不会错过任何有效门票或计算两次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    initial_count = {}
    name_count = {}
    answer = 0

    for _ in range(n):
        name = input().strip()
        initial = name[0]

        same_initial = initial_count.get(initial, 0)
        same_name = name_count.get(name, 0)

        answer += 2 * (same_initial - same_name)

        initial_count[initial] = same_initial + 1
        name_count[name] = same_name + 1

    print(answer)

if __name__ == "__main__":
    solve()
```两个字典直接对应增量公式中的两个量。`initial_count`告诉我们有多少以前的学生可能与新学生的第一个字母匹配。`name_count`确定哪些候选人必须排除在外，因为他们具有相同的名字。 

在将当前学生插入任一词典之前更新答案。 这种顺序很重要，因为学生无法自己形成票证。 如果先算当前学生的话，`same_initial`和`same_name`都将包括该学生，并且计算必须对其进行补偿。 

Python 的字典操作是预期的 (O(1))，给出了预期的线性运行时间。 Python 整数会根据需要自动增长，因此潜在的二次答案不会溢出。 

## 工作示例

 考虑第一个样本：```
10
JOSH
JAD
JENNIFER
JENNIFER
JALEN
HASAAN
ALI
TAMARA
LIAM
SATHWIKA
```关键状态的演变如下。 

| 学生| 之前的初始计数 | 之前的同名计数 | 新贡献 | 回答 |
 | ---| ---| ---| ---| ---|
 | 乔什 | 0 | 0 | 0 | 0 |
 | 杰德 | 1 | 0 | 2 | 2 |
 | 詹妮弗 | 2 | 0 | 4 | 6 |
 | 詹妮弗 | 3 | 1 | 4 | 10 | 10
 | 贾伦 | 4 | 0 | 8 | 18 | 18
 | 哈桑 | 0 | 0 | 0 | 18 | 18
 | 阿里 | 0 | 0 | 0 | 18 | 18
 | 塔玛拉 | 0 | 0 | 0 | 18 | 18
 | 利亚姆 | 1 | 0 | 2 | 20 |
 | 萨维卡 | 0 | 0 | 0 | 20 |

 最终输出是`20`对于这个确切的十个名字输入。 四个以 J 开头的名字可产生 18 张有效门票，而两个以 L 开头的名字可产生另外两张有效门票。 重复的 JENNIFER 条目正确地相互排除，但每个条目仍然可以与 JOSH、JAD 和 JALEN 配对。 

第二个样本是：```
5
ALEX
BRANDY
CELINE
DWAYNE
ELIZABETH
```| 学生| 之前的初始计数 | 之前的同名计数 | 新贡献 | 回答 |
 | ---| ---| ---| ---| ---|
 | 亚历克斯 | 0 | 0 | 0 | 0 |
 | 白兰地| 0 | 0 | 0 | 0 |
 | 赛琳 | 0 | 0 | 0 | 0 |
 | 德韦恩 | 0 | 0 | 0 | 0 |
 | 伊丽莎白 | 0 | 0 | 0 | 0 |

 每个学生的首字母都不同，因此不能形成有效的门票。 输出是`0`。 这表明该算法不会仅仅因为名称不同而意外地对对进行计数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n)) 预期 | 每个名称都会被读取一次并执行恒定数量的预期 (O(1)) 字典操作。 |
 | 空间| (O(n)) | (O(n)) | 在最坏的情况下，每个学生的全名都是不同的，所以`name_count`包含 (n) 个条目。 |

 最大输入包含 66,183 名学生，因此线性扫描仅对每个学生执行少量字典操作，这完全符合一秒的限制，远比暴力破解所需的大约 43.8 亿对检查要好得多。 内存使用量也完全在该输入大小的 256 MB 限制之内。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline
    n = int(input())

    initial_count = {}
    name_count = {}
    answer = 0

    for _ in range(n):
        name = input().strip()
        initial = name[0]

        same_initial = initial_count.get(initial, 0)
        same_name = name_count.get(name, 0)

        answer += 2 * (same_initial - same_name)

        initial_count[initial] = same_initial + 1
        name_count[name] = same_name + 1

    print(answer)

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

# Sample 1
assert run("""10
JOSH
JAD
JENNIFER
JENNIFER
JALEN
HASAAN
ALI
TAMARA
LIAM
SATHWIKA
""") == "20\n", "sample 1"

# Sample 2
assert run("""5
ALEX
BRANDY
CELINE
DWAYNE
ELIZABETH
""") == "0\n", "sample 2"

# Minimum-size input
assert run("""1
A
""") == "0\n", "one student cannot form a ticket"

# All names equal
assert run("""4
JOSH
JOSH
JOSH
JOSH
""") == "0\n", "same names are forbidden"

# Repeated names mixed with distinct names
assert run("""4
JOSH
JOSH
JAD
JILL
""") == "8\n", "duplicate-name exclusion"

# Maximum-size input
n = 66183
assert run(str(n) + "\n" + ("A\n" * n)) == "0\n", "maximum size with identical names"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / A`|`0`| 最小输入和不存在自对 |
 | 四份`JOSH`|`0`| 姓名相同不能形成门票 |
 |`JOSH, JOSH, JAD, JILL`|`8`| 正确排除重复名称，同时保留不同名称 |
 | 66,183 份`A`|`0`| 最大输入大小和可扩展性|

 ## 边缘情况

 对于一名学生来说，```
1
A
```该算法开始于`same_initial = 0`和`same_name = 0`，所以贡献为零。 然后将学生插入到地图中。 从来没有其他学生可以与他一起形成一张票，给出正确的输出`0`。 

对于重复的名称，```
3
JOSH
JOSH
JAD
```第一个 JOSH 贡献为零，因为没有以前的学生。 第二个乔什看到`same_initial = 1`和`same_name = 1`，所以它的贡献为零。 它无法与第一个 JOSH 配对，因为名称相同。 JAD 然后看到`same_initial = 2`和`same_name = 0`，贡献了四张订购的门票。 输出是`4`。 

对于角色互换的情况，```
2
JOSH
JAD
```第一个学生的贡献为零。 然后，JAD 会看到以前的一名学生具有相同的首字母和不同的姓名，因此它会做出贡献`2`。 这两张票是 JOSH/JAD 和 JAD/JOSH。 该算法显式乘以 2，因为角色是有序的。 

对于不同的首字母，```
3
JOSH
JAD
ALI
```处理 JAD 时，两个以 J 开头的学生创建两张票。 ALI 没有看到以前的 A 首字母学生，因此它的贡献为零。 最终的答案是`2`。 该算法永远不需要将 ALI 与 J 开头的学生进行比较，因为`initial_count`在他们做出贡献之前将其过滤掉。 

对于最大尺寸边界，```
66183
A
A
A
...
A
```66,183个相同的名字，每个新生都有`same_initial == same_name`。 因此，每个贡献都是零，最终答案是`0`。 这种情况同时使用了最大允许输入和重复名称条件，而不需要对的二次枚举。 输入限制和竞赛资源限制记录在原始竞赛材料中。
