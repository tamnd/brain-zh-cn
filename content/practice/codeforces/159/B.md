---
title: "CF 159B - 媒人"
description: "我们有两个对象集合。 标记由（颜色、直径）描述，盖子也由（颜色、直径）描述。 仅当直径相等时才能将盖子连接到标记上。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 159
codeforces_index: "B"
codeforces_contest_name: "VK Cup 2012 Qualification Round 2"
rating: 1100
weight: 159
solve_time_s: 121
verified: true
draft: false
---

[CF 159B - 媒人](https://codeforces.com/problemset/problem/159/B)

 **评分：** 1100
 **标签：** *特殊、贪婪、排序
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个对象集合。 标记描述为`(color, diameter)`并且上限也被描述为`(color, diameter)`。 

仅当直径相等时才能将盖子连接到标记上。 在所有有效的配对中，当颜色也匹配时，有些配对被认为是“美丽的”。 

优化目标有两层。 首先，最大化匹配标记帽对的总数。 在实现这一最大化的所有方法中，最大化漂亮匹配的数量。 

记号笔和帽子最多只能使用一次。 

限制足够大，我们无法直接尝试每个配对。 两个都`n`和`m`可以达到`10^5`，所以一个`O(n * m)`解决方案的性能可达`10^10`比较，远远超出了时间限制。 我们需要一些接近线性或`O(n log n)`。 

最重要的观察结果是直径完全决定兼容性。 带有直径的盖子`5`永远不能与直径标记相互作用`7`。 这意味着每个直径组都可以独立加工。 

有几种边缘情况很容易破坏粗心的解决方案。 

考虑这个输入：```
2 2
1 5
2 5
3 5
4 5
```正确答案是：```
2 0
```每个标记仍然可以闭合，因为所有直径都匹配，即使没有颜色匹配。 只搜索漂亮匹配的错误贪婪策略将会返回`0 0`。 

现在考虑：```
2 1
1 3
1 3
1 3
```正确答案是：```
1 1
```仅存在一个盖子，因此只能关闭一个标记。 忘记每个盖子都是一次性的会错误地产生`2 2`。 

另一个微妙的情况是，过早最大化漂亮的匹配会减少匹配的总数。```
2 2
1 1
2 1
1 1
3 1
```正确答案是：```
2 1
```如果我们首先贪婪地消耗唯一的`(1,1)`第一个标记上盖，第二个标记仍然可以使用`(3,1)`，所以一切正常。 但在更复杂的变体中，在不考虑主要目标的情况下消耗上限可能会减少封闭标记的总数。 该问题明确表明总匹配比漂亮匹配更重要，因此算法必须保留该优先级。 

## 方法

 蛮力的想法很简单。 对于每个标记，扫描所有盖子并挑选任何未使用的具有相同直径的盖子。 如果可能的话，最好选择颜色也相配的帽子。 

这种方法在逻辑上是正确的，因为它尝试直接构建有效的配对。 这个问题在概念上看起来很小，但约束破坏了这个解决方案。 和`10^5`标记和`10^5`上限，我们可以执行`10^10`兼容性检查。 即使在优化的语言中，这也太慢了。 

关键的观察结果是兼容性仅取决于直径。 一旦我们按直径对所有东西进行分组，不同的组就会变得完全独立。 

假设我们关注一个固定直径`d`。 该组内：```
marker colors: frequencies
cap colors: frequencies
```我们可以关闭的最大标记数很简单：```
min(total markers with diameter d,
    total caps with diameter d)
```对于第一个目标来说，颜色信息并不重要。 

然后，在尽可能多的配对中，我们想要尽可能多的漂亮搭配。 对于特定颜色`c`，我们可以创建的漂亮对的数量是：```
min(markers[d][c], caps[d][c])
```因为每一场漂亮的比赛都会消耗一个与该颜色完全相同的记号笔和一个帽子。 

至关重要的是，最大化漂亮的比赛永远不会减少比赛的总数。 漂亮的对已经是有效的对，并且同一直径组内任何剩余的不匹配的项目仍然可以任意配对，直到我们达到最大可能的数量。 

这将问题简化为频率计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(米) | 太慢了 |
 | 最佳| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 读取所有标记并按直径和颜色对它们进行分组。 

对于每个标记`(x, y)`，增量：```
markers_by_diameter[y]
markers_by_color[(y, x)]
```第一个结构跟踪直径存在多少个标记。 第二个轨道准确`(diameter, color)`频率。 
2. 阅读所有大写字母并以相同的方式将它们分组。 

对于每个上限`(a, b)`，增量：```
caps_by_diameter[b]
caps_by_color[(b, a)]
```3. 计算闭合标记的最大数量。 

对于出现的每个直径，添加：```
min(markers_by_diameter[d],
    caps_by_diameter[d])
```这是该直径可能的最大对数，因为只有相等的直径才能相互作用。 
4. 计算漂亮匹配的最大数量。 

对于每一个`(diameter, color)`对出现在标记之间的，添加：```
min(markers_by_color[(d, c)],
    caps_by_color[(d, c)])
```每对这样的配对都对应着一次美妙的比赛机会。 
5. 打印两个总计。 

### 为什么它有效

 该算法依赖于直径组是独立的这一事实。 一种直径的盖子永远无法帮助另一种直径的标记。 

在固定直径组内，有效对的最大数量完全由较小的一侧决定。 如果有8个标记和5个直径盖`d`，任何策略都不能创建超过 5 对，任意任意配对都可以达到 5 个。 

漂亮的匹配是对那些已经有效的配对的改进。 对于每种颜色，我们贪婪地创建尽可能多的等色对。 这不会减少对的总数，因为每对漂亮的对已经消耗了一个无论如何都兼容的标记和帽子。 其余未配对的物品仍可按直径任意配对。 

由于两个目标在每个直径组内都独立且一致地优化，因此最终答案是全局最优的。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

n, m = map(int, input().split())

markers_by_diameter = defaultdict(int)
caps_by_diameter = defaultdict(int)

markers_by_color = defaultdict(int)
caps_by_color = defaultdict(int)

for _ in range(n):
    x, y = map(int, input().split())
    markers_by_diameter[y] += 1
    markers_by_color[(y, x)] += 1

for _ in range(m):
    a, b = map(int, input().split())
    caps_by_diameter[b] += 1
    caps_by_color[(b, a)] += 1

closed = 0
beautiful = 0

all_diameters = set(markers_by_diameter.keys()) | set(caps_by_diameter.keys())

for d in all_diameters:
    closed += min(markers_by_diameter[d], caps_by_diameter[d])

for key, cnt in markers_by_color.items():
    beautiful += min(cnt, caps_by_color[key])

print(closed, beautiful)
```实现的第一部分构建频率表。 使用`defaultdict(int)`避免重复的存在检查并保持更新恒定时间。 

该代码将按直径计数与按精确计数分开`(diameter, color)`对。 这反映了问题中的两个优化目标。 直径计数决定了总匹配的最大数量，而精确的配对计数则决定了漂亮匹配的最大数量。 

计算总闭合标记时使用直径集的并集。 这样可以避免遗漏仅出现在一侧的直径。 

对于漂亮的匹配，迭代标记键就足够了。 如果一个`(diameter, color)`caps 中不存在对，defaultdict 自动返回零。 

不需要排序，因为问题只取决于频率，而不取决于顺序。 

## 工作示例

 ### 示例 1

 输入：```
3 4
1 2
3 4
2 4
5 4
2 4
1 1
1 2
```### 直径计数

 | 直径| 标记| 帽子 | 贡献 |
 | ---| ---| ---| ---|
 | 2 | 1 | 1 | 1 |
 | 4 | 2 | 2 | 2 |

 关闭标记总数 =`1 + 2 = 3`### 漂亮的比赛很重要

 | 直径| 颜色 | 标记计数 | 上限计数 | 美丽的一对|
 | ---| ---| ---| ---| ---|
 | 2 | 1 | 1 | 1 | 1 |
 | 4 | 3 | 1 | 0 | 0 |
 | 4 | 2 | 1 | 1 | 1 |

 漂亮比赛总数 =`2`输出：```
3 2
```该轨迹表明，最大化美丽匹配是在每个直径组内独立完成的。 直径上无与伦比的颜色`4`仍然参加正常的比赛。 

### 示例 2

 输入：```
4 3
1 1
2 1
3 2
4 2
2 1
5 2
3 2
```### 直径计数

 | 直径| 标记| 帽子 | 贡献 |
 | ---| ---| ---| ---|
 | 1 | 2 | 1 | 1 |
 | 2 | 2 | 2 | 2 |

 关闭标记总数 =`3`### 漂亮的比赛很重要

 | 直径| 颜色 | 标记计数 | 上限计数 | 美丽的一对|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 0 | 0 |
 | 1 | 2 | 1 | 1 | 1 |
 | 2 | 3 | 1 | 1 | 1 |
 | 2 | 4 | 1 | 0 | 0 |

 漂亮比赛总数 =`2`输出：```
3 2
```此示例表明，由于没有足够的相同直径的盖子，一些标记不可避免地保持不匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 每个标记和盖子均处理一次 |
 | 空间| O(n + m) | 频率表存储所有不同的组 |

 该解决方案很容易满足限制。 至多有`2 * 10^5`对象总数，Python 中的线性处理足够快，并且哈希映射在内存限制内保持良好状态。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    markers_by_diameter = defaultdict(int)
    caps_by_diameter = defaultdict(int)

    markers_by_color = defaultdict(int)
    caps_by_color = defaultdict(int)

    for _ in range(n):
        x, y = map(int, input().split())
        markers_by_diameter[y] += 1
        markers_by_color[(y, x)] += 1

    for _ in range(m):
        a, b = map(int, input().split())
        caps_by_diameter[b] += 1
        caps_by_color[(b, a)] += 1

    closed = 0
    beautiful = 0

    all_diameters = set(markers_by_diameter) | set(caps_by_diameter)

    for d in all_diameters:
        closed += min(markers_by_diameter[d], caps_by_diameter[d])

    for key, cnt in markers_by_color.items():
        beautiful += min(cnt, caps_by_color[key])

    print(closed, beautiful)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue().strip()

# provided sample
assert run(
"""3 4
1 2
3 4
2 4
5 4
2 4
1 1
1 2
"""
) == "3 2", "sample 1"

# minimum size
assert run(
"""1 1
1 1
1 1
"""
) == "1 1", "minimum case"

# same diameter, different colors
assert run(
"""2 2
1 5
2 5
3 5
4 5
"""
) == "2 0", "all matches but no beautiful pairs"

# insufficient caps
assert run(
"""3 1
1 2
1 2
1 2
1 2
"""
) == "1 1", "single cap only"

# mixed groups
assert run(
"""4 3
1 1
2 1
3 2
4 2
2 1
5 2
3 2
"""
) == "3 2", "multiple diameter groups"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 具有相同特性的单一标记和盖子 |`1 1`| 最小有效输入 |
 | 所有直径相同但颜色不同 |`2 0`| 总比分和漂亮比赛是不同的目标|
 | 许多标记，但只有一个帽子 |`1 1`| 帽子是一次性的 |
 | 多直径组 |`3 2`| 按直径独立加工|

 ## 边缘情况

 考虑颜色永远不匹配但直径匹配的情况。 

输入：```
2 2
1 5
2 5
3 5
4 5
```该算法计算：```
diameter 5:
markers = 2
caps = 2
```所以总的闭合标记变为`2`。 

为了漂亮的比赛：```
(5,1): min(1,0) = 0
(5,2): min(1,0) = 0
```最终的答案是：```
2 0
```这证实了该算法没有错误地要求普通匹配的颜色相等。 

现在考虑大写字母太少的重复相同标记。 

输入：```
3 1
1 2
1 2
1 2
1 2
```该算法计算：```
diameter 2:
markers = 3
caps = 1
```所以只有一场完整的比赛是可能的。 

为了漂亮的比赛：```
(2,1): min(3,1) = 1
```答案变成：```
1 1
```这验证了每个上限最多被消耗一次。 

最后，考虑孤立的直径组。 

输入：```
2 2
1 1
2 2
1 2
2 3
```直径贡献：```
diameter 1: min(1,0) = 0
diameter 2: min(1,1) = 1
diameter 3: min(0,1) = 0
```漂亮的比赛：```
(2,2): min(1,0) = 0
```输出：```
1 0
```这说明不同直径组是完全独立的，不能互相帮助。
