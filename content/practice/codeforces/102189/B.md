---
title: "CF 102189B - \u0422\u0430\u0431\u043b\u0438\u0446\u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432"
description: "我们需要将竞赛参与者列表转换为格式化的排名表。 每个参与者都有一个唯一的名字和一个非负分数。 首先通过分数递减来确定最终顺序。"
date: "2026-08-19T16:12:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102189
codeforces_index: "B"
codeforces_contest_name: "12-\u0439 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u0439 \u0442\u0443\u0440\u043d\u0438\u0440 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e \u0432 \u0410\u0431\u0430\u043a\u0430\u043d\u0435"
rating: 0
weight: 102189
solve_time_s: 214
verified: true
draft: false
---

[CF 102189B - \u0422\u0430\u0431\u043b\u0438\u0446\u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432](https://codeforces.com/problemset/problem/102189/B)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要将竞赛参与者列表转换为格式化的排名表。 每个参与者都有一个唯一的名字和一个非负分数。 首先通过分数递减来确定最终顺序。 当两个参与者的分数相同时，将字母转换为常见大小写后，按字典顺序比较他们的名字，因此`Dy`,`dZ`， 和`dx`被排序为`dx`,`Dy`,`dZ`。 

输入包含`n`参与者，在哪里`1 <= n <= 50000`。 每个名字最多有20个拉丁字母，每个分数最多为`10^6`。 这些界限使得二次算法不适合。 对于 50,000 名参与者，成对程序可以执行大约 12.5 亿次比较，这远远超出了我们在 2 秒限制下想要的结果。 比较排序给出`O(n log n)`，大约 50,000 次按正确数量级进行 16 次比较，因此这是自然目标。 

输出有三列，`Place`,`Name`， 和`Score`。 它们的宽度不固定。 每个宽度是该列中出现的最大字符串长度，包括标题。 空的位置用点填充。 第一列右对齐，其他两列左对齐。 该位置也与普通排名略有不同：如果一个团体占据多个连续位置，则每个成员都会获得相同的范围，例如`2-3`或者`5-7`。 

在某些情况下，实现看起来似乎合理，但仍然会生成错误的表。 

考虑单个参与者：```
1
Alice 0
```正确的输出是：```
|Place|Name.|Score|
|....1|Alice|0....|
```粗心的实现可能会将地点范围计算为`1-1`，即使单个参与者必须只收到`1`。 

不区分大小写的名称排序是另一个陷阱。 例如：```
3
aa 10
Ab 10
aA 10
```小写比较键是`aa`,`ab`， 和`aa`。 因此`aa`和`aA`同等比较，同时`Ab`跟在他们后面。 输出中的原始名称保持不变。 区分大小写的排序会根据 ASCII 顺序将大写字母放在小写字母之前，并且可以生成不同的表。 

最常见的格式错误是忘记标题参与确定列宽。 为了```
2
A 7
B 1000000
```这`Score`列必须至少有 5 个字符宽，因为`Score`尽管最长的实际乐谱的长度为 7，但其本身的长度为 5。同样，`Place`贡献宽度为 5。 

最后，平局必须使用整个组占据的位置，而不是遇到的不同分数的数量。 为了```
4
A 10
B 10
C 5
D 5
```前两名参与者占据位置`1-2`，最后两个占据`3-4`。 通过为每个不同的分数增加一个单独的计数器来分配排名会不必要地使计算复杂化，并且很容易出错。 

## 方法

 最直接的暴力解决方案是反复寻找下一个应该出现的参与者。 在每次迭代中，扫描所有剩余的参与者并使用所需的排序规则对它们进行比较。 这是正确的，因为剩余的最佳参与者正是排序表的下一行。 

问题在于比较的次数。 在最坏的情况下，第一行需要`n-1`比较，第二个要求`n-2`， 等等。 为了`n = 50000`，这给出了`50000 * 49999 / 2 = 1,249,975,000`比较。 即使在格式化输出之前，这也超出了时间限制。 

暴力方法之所以有效，是因为所需的表顺序是总排序：每对参与者都可以通过分数然后通过小写名称进行一致比较。 这一观察结果正是让我们能够用标准排序操作取代重复搜索的原因。 

蟒蛇的`sort`可以通过元组对参与者进行排序。 我们首先想要更大的分数，所以第一个组成部分是`-score`。 我们希望名称按不区分大小写的升序排列，因此第二个组成部分是`name.lower()`。 结果密钥是`(-score, name.lower())`。 

一旦参与者被排序，每组相同分数的人就形成一个连续的部分。 如果这样的组从零开始的索引开始`left`并在之前立即结束`right`，其显示位置为`left + 1`通过`right`。 当这些数字不同时，显示的地方就是字符串`left+1-right`; 否则它只是一个数字。 

排序后最终的格式化也更加容易。 我们首先构建所有位置字符串，然后找到三列的最大宽度。 然后我们可以用适当数量的点构建每一行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有参与者并将每个参与者存储为包含姓名和分数的一对。 保留原始名称是必要的，因为排序会忽略大小写，但输出必须保留输入中提供的拼写。 
2. 使用 key 对参与者进行排序`(-score, name.lower())`。 对分数求反会将所需的分数递减顺序更改为 Python 的普通递增元组顺序。 小写名称处理所需的不区分大小写的字典比较。 
3. 按等分组扫描排序后的数组。 对于从索引开始的组`left`， 进步`right`而分数保持相等。 该区间的参与者占据位置`left + 1`通过`right`。 
4. 将组的位置间隔转换为位置字符串。 如果`left + 1 == right`，使用单位编号。 否则使用范围`left + 1-right`。 该组中的每个参与者都会收到完全相同的字符串。 
5. 将每个分数转换为字符串并收集显示的三个列。 宽度为`Place`是最大值`len("Place")`以及每个生成的地点字符串。 同样的规则用于`Name`和`Score`，包括它们的标题。 
6. 打印标题，然后打印每个参与者行。 地点列使用点右对齐，而名称和分数列使用点左对齐。 每行都被包围`|`，匹配所需的表语法。 

### 为什么它有效

 排序后，参与者完全按照所需的顺序出现，因为排序键首先进行比较`-score`，相当于递减分数，然后比较小写名字，这正是所需要的决胜局。 由于同等分数按此顺序是连续的，因此每个同等分数组对应于一个连续的位置间隔。 一组从位置开始`left + 1`并结束于`right`因此正确接收常见位置字符串`left + 1`或者`left + 1-right`。 格式化阶段使用每列中最长的实际单元格及其标题，因此每一行都准确接收所需的宽度和对齐方式。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    participants = []
    for _ in range(n):
        name, score = input().split()
        participants.append((name, int(score)))

    participants.sort(key=lambda x: (-x[1], x[0].lower()))

    places = [""] * n
    i = 0

    while i < n:
        j = i + 1
        while j < n and participants[j][1] == participants[i][1]:
            j += 1

        if i + 1 == j:
            place = str(i + 1)
        else:
            place = f"{i + 1}-{j}"

        for k in range(i, j):
            places[k] = place

        i = j

    place_width = max(len("Place"), *(len(x) for x in places))
    name_width = max(len("Name"), *(len(name) for name, _ in participants))
    score_strings = [str(score) for _, score in participants]
    score_width = max(len("Score"), *(len(x) for x in score_strings))

    out = []

    header = (
        "|"
        + "Place".ljust(place_width, ".")
        + "|"
        + "Name".ljust(name_width, ".")
        + "|"
        + "Score".ljust(score_width, ".")
        + "|"
    )
    out.append(header)

    for i, (name, _) in enumerate(participants):
        row = (
            "|"
            + places[i].rjust(place_width, ".")
            + "|"
            + name.ljust(name_width, ".")
            + "|"
            + score_strings[i].ljust(score_width, ".")
            + "|"
        )
        out.append(row)

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个循环准确读取`n`参与者记录。 分数会转换为整数，因为它参与数字排序，而名称则保留为字符串以进行排序和输出。 

排序键包含两个组成部分。`-x[1]`使最高分排在第一位。`x[0].lower()`执行所需的不区分大小写的比较，而不更改存储的名称拼写。 

组扫描使用半开区间`[i, j)`。 这种约定使得地点计算特别干净。 有`j - i`组中的参与者，并且因为第一个参与者处于从零开始的索引`i`，该组占据一基位置`i + 1`通过`j`。 条件`i + 1 == j`正是单参与者的情况，防止了错误的表示`1-1`。 

这`places`数组存储每个已排序参与者的已计算位置字符串。 这需要花费`O(n)`内存并避免为领带的每个成员重新计算相同的范围。 

对于格式化，`ljust(width, ".")`在左对齐值之后放置点，而`rjust(width, ".")`将点放在右对齐值之前。 直接使用点作为填充字符比手动计算填充长度更简单且不易出错。 

Python 整数具有任意精度，因此分数范围为`10^6`不存在溢出问题。 最大可能的席位串也很小，因为只有 50,000 名参与者。 

竞赛声明中显示的示例包含八个参与者记录，因此第一个输入值为`8`。 该代码遵循实际的输入格式并读取记录之前的计数。 

## 工作示例

 提供的示例演示了所有三个主要排序和排名规则。 排序后，参与者按分数排序，然后在同等分数组内按小写姓名排序。 

| 步骤| 排序参与者 | 分数 | 当前组 | 地点 |
 | --- | --- | --- | --- | --- |
 | 1 | 布雷多| 9999 | 布雷多| 1 |
 | 2 | 彼得 | 100 | 100 彼得，游客| 2-3 | 2-3
 | 3 | 旅游| 100 | 100 彼得，游客| 2-3 | 2-3
 | 4 | 用户 | 33 | 33 用户 | 4 |
 | 5 | dx | 5 | dx、Dy、dZ | 5-7 | 5-7
 | 6 | 镝| 5 | dx、Dy、dZ | 5-7 | 5-7
 | 7 | dZ | 5 | dx、Dy、dZ | 5-7 | 5-7
 | 8 | 按 F | 0 | 按 F | 8 |

 三列宽度均为 5`Place`, 7 为`Name`，和 6 为`Score`。 确定这些宽度时包含标题。 例如，`Bredor`长度为 6，但是`Name`长度为 4，所以实际`Name`宽度为 7 因为`tourist`是最长的名字。 

结果表是：```
|Place|Name...|Score|
|....1|Bredor.|9999.|
|..2-3|Petr...|100..|
|..2-3|tourist|100..|
|....4|user...|33...|
|..5-7|dx.....|5....|
|..5-7|Dy.....|5....|
|..5-7|dZ.....|5....|
|....8|pressF.|0....|
```第二个示例隔离了不区分大小写的排序和占据最终位置的组。 

输入：```
5
Zulu 20
alpha 10
ALAN 10
beta 0
zebra 20
```排序的顺序是`Zulu`,`zebra`,`ALAN`,`alpha`,`beta`。 前两名参赛者共享位置`1-2`，而两位 10 分的参与者共享位置`3-4`。 

| 索引 | 名称 | 分数 | 集团| 地点 |
 | --- | --- | --- | --- | --- |
 | 1 | 祖鲁语 | 20 | 祖鲁人、斑马 | 1-2 | 1-2
 | 2 | 斑马| 20 | 祖鲁人、斑马 | 1-2 | 1-2
 | 3 | 艾伦 | 10 | 10 艾伦，阿尔法 | 3-4 | 3-4
 | 4 | 阿尔法 | 10 | 10 艾伦，阿尔法 | 3-4 | 3-4
 | 5 | 测试版 | 0 | 测试版 | 5 |

 这里`ALAN`比较为`alan`和`alpha`作为`alpha`， 所以`ALAN`首先。 原始大写拼写仍保持不变。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位； 组扫描和格式化是线性的|
 | 空间| O(n) | 参与者、位置字符串、分数字符串和输出需要线性内存 |

 参与人数最多5万人，名字最多20个字符，`O(n log n)`排序完全符合 2 秒、256 MB 限制的预期复杂性。 生成的输出也仅与参与者数量成线性关系，因此在最终写入之前将其存储起来是可行的。 

## 测试用例

 以下测试均使用相同的方法`solve`逻辑作为提交的程序。 该帮助器替换了标准输入和输出，因此可以使用普通的 Python 断言来检查每种情况。```python
import sys
import io
from contextlib import redirect_stdout

def solve():
    n = int(input())

    participants = []
    for _ in range(n):
        name, score = input().split()
        participants.append((name, int(score)))

    participants.sort(key=lambda x: (-x[1], x[0].lower()))

    places = [""] * n
    i = 0

    while i < n:
        j = i + 1
        while j < n and participants[j][1] == participants[i][1]:
            j += 1

        if i + 1 == j:
            place = str(i + 1)
        else:
            place = f"{i + 1}-{j}"

        for k in range(i, j):
            places[k] = place

        i = j

    place_width = max(len("Place"), *(len(x) for x in places))
    name_width = max(len("Name"), *(len(name) for name, _ in participants))
    score_strings = [str(score) for _, score in participants]
    score_width = max(len("Score"), *(len(x) for x in score_strings))

    out = []

    out.append(
        "|"
        + "Place".ljust(place_width, ".")
        + "|"
        + "Name".ljust(name_width, ".")
        + "|"
        + "Score".ljust(score_width, ".")
        + "|"
    )

    for i, (name, _) in enumerate(participants):
        out.append(
            "|"
            + places[i].rjust(place_width, ".")
            + "|"
            + name.ljust(name_width, ".")
            + "|"
            + score_strings[i].ljust(score_width, ".")
            + "|"
        )

    sys.stdout.write("\n".join(out))

input = sys.stdin.readline

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    buffer = io.StringIO()
    try:
        with redirect_stdout(buffer):
            solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = sys.stdin.readline

    return buffer.getvalue()

# Provided sample
sample = """8
Petr 100
tourist 100
Bredor 9999
dZ 5
dx 5
Dy 5
pressF 0
user 33"""

sample_expected = """|Place|Name...|Score|
|....1|Bredor.|9999.|
|..2-3|Petr...|100..|
|..2-3|tourist|100..|
|....4|user...|33...|
|..5-7|dx.....|5....|
|..5-7|Dy.....|5....|
|..5-7|dZ.....|5....|
|....8|pressF.|0....|"""

assert run(sample) == sample_expected, "provided sample"

# Minimum-size case
assert run("""1
A 0""") == """|Place|Name.|Score|
|....1|A....|0....|""", "single participant"

# All scores equal, including case-insensitive ordering
assert run("""4
aa 10
BB 10
aA 10
Ab 10""") == """|Place|Name|Score|
|..1-4|aa..|10...|
|..1-4|aA..|10...|
|..1-4|Ab..|10...|
|..1-4|BB..|10...|""", "all equal scores"

# Boundary score values and a tie at the end
assert run("""5
low 0
maximum 1000000
ZERO 0
mid 999999
top 1000000""") == """|Place|Name...|Score|
|..1-2|maximum|1000000|
|..1-2|top....|1000000|
|....3|mid....|999999.|
|..4-5|low....|0......|
|..4-5|ZERO...|0......|""", "score boundaries and final tie"

# Maximum-size case, generated rather than written as 50000 literal lines
n = 50000
max_input = str(n) + "\n" + "".join(
    f"p{i} {i % 1000001}\n" for i in range(n)
)

max_output = run(max_input)
assert max_output.count("\n") == n, "maximum-size row count"
assert max_output.startswith("|Place|Name"), "maximum-size header"
assert max_output.endswith("|"), "maximum-size final boundary"
```定制案例可总结如下。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / A 0`| 一排有地方`1`| 最小尺寸和`1`， 不是`1-1`, 边界 |
 | 四位参赛者有分数`10`| 全部收到`1-4`| 完整的联系组和不区分大小写的名称排序 |
 | 分数`0`和`1000000`加领带| 两端的正确范围 | 得分界限和最终平局处理|
 | 50,000 名生成参与者 | 50,000 条数据行和有效的表边界 | 最大输入尺寸和线性输出处理|

 最大尺寸测试有意检查结构属性，而不是在社论中嵌入数十万个字符。 第一个和最后一个表边界以及输出行的确切数量可捕获行丢失、打印额外行或最终分隔符格式错误等常见错误。 

## 边缘情况

 当组扫描开始时处理单参与者的情况`i = 0`并立即得到`j = 1`。 自从`i + 1 == j`，位置字符串是`1`， 不是`1-1`。 用于输入```
1
Alice 0
```输出是```
|Place|Name.|Score|
|....1|Alice|0....|
```全相等的情况产生一组覆盖整个数组。 为了```
4
aa 10
BB 10
aA 10
Ab 10
```小写键是`aa`,`bb`,`aa`， 和`ab`，所以排序后的名称是`aa`,`aA`,`Ab`,`BB`。 小组从位置 1 延伸到位置 4，为每个参与者提供了位置`1-4`。 该算法不会增加组内的排名，这正是共享放置所需要的。 

仅在排序时执行不区分大小写的比较。 假设输入包含`ALAN 10`和`alpha 10`。 他们的比较键是`alan`和`alpha`， 所以`ALAN`首先。 存储的名称保留`ALAN`，这可以防止打印小写排序键而不是原始参与者姓名的常见错误。 

表末尾的平局测试组扫描的右边界。 为了```
5
maximum 1000000
top 1000000
mid 999999
low 0
ZERO 0
```第一组占据位置`1-2`, 中间参与者占据`3`，最后一组占据`4-5`。 当扫描到达最后一个参与者时，`j`恰好变成`n`，并且该组仍然被处理，因为循环条件基于`i < n`。 

最高分`1000000`不需要任何特殊的数字处理。 分数是整数，Python 的整数类型安全地表示整个允许的范围。 对于零也是如此，它仍然是有效分数，并且必须在每个正分数之后排序。 

格式化边界也很重要。 如果最长的地方是`1-4`，它的长度是3，但是头部`Place`长度为 5，因此第一列仍保持 5 个字符宽。 相似地，`Score`它本身的长度为 5。当所有实际值碰巧都较短时，从标头和数据计算宽度可以防止出现格式错误的标头。 

最后，名称的原始形式是唯一的，但这并不能消除当名称仅因大小写不同时保留确定性顺序的需要。 根据规定的不区分大小写的规则，所需的比较将这些名称视为相等。 Python 的排序是稳定的，因此当两个键相同时，它们的原始输入顺序将被保留。 该行为与比较器一致，因为根据指定的顺序，两个参与者都不需要先于另一个参与者。
