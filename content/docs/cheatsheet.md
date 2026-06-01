---
title: "备忘单"
weight: 1
description: "快速参考，包括 Markdown、短代码和前言的实时预览。"
date: 2026-05-02T11:50:02+07:00
---

# 备忘单

 每个部分都会显示语法，并附有实时预览。 
## 警报````markdown
> [!NOTE]
> General info the reader should not miss.
````

 > [!注意]
 > 读者不应错过的一般信息。````markdown
> [!TIP]
> Helpful suggestion.
````

 > [!提示]
 > 有用的建议。````markdown
> [!IMPORTANT]
> Must-know info.
````

 > [!重要]
 > 必须知道的信息。````markdown
> [!WARNING]
> Could cause problems.
````

 > [!警告]
 > 可能会导致问题。````markdown
> [!CAUTION]
> Risk of harm or data loss.
````

 > [!警告]
 > 伤害或数据丢失的风险。 
＃＃ 细节````markdown
{{</* details title="Click to expand" */>}}
Hidden content revealed on click.
{{</* /details */>}}
````{{< details title="Click to expand" >}}点击即可显示隐藏内容。{{< /details >}}

````markdown
{{</* details title="Open by default" open=true */>}}
Visible immediately.
{{</* /details */>}}
````{{< details title="Open by default" open=true >}}立即可见。{{< /details >}}## 标签````markdown
{{</* tabs */>}}
{{</* tab "Go" */>}}
```去
 fmt.Println("你好")```
{{</* /tab */>}}
{{</* tab "Python" */>}}
```蟒蛇
 打印（“你好”）```
{{</* /tab */>}}
{{</* tab "Rust" */>}}
```生锈
 println!("你好");```
{{</* /tab */>}}
{{</* /tabs */>}}
````{{< tabs >}}
{{< tab "Go" >}}
```go
fmt.Println("hello")
```
{{< /tab >}}
{{< tab "Python" >}}
```python
print("hello")
```
{{< /tab >}}
{{< tab "Rust" >}}
```rust
println!("hello");
```
{{< /tab >}}
{{< /tabs >}}## 步骤````markdown
{{</* steps */>}}

1. **Install Hugo**

   Download the extended binary from gohugo.io.

2. **Clone the repo**

   `git clone git@github.com:tamnd/brain.git`

3. **Run locally**

   `hugo server`

{{</* /steps */>}}
````{{< steps >}}1. **安装Hugo**

 从 gohugo.io 下载扩展二进制文件。 

2. **克隆存储库**`git clone git@github.com:tamnd/brain.git`3. **本地运行**`hugo server`

{{< /steps >}}＃＃ 徽章````markdown
{{</* badge content="stable" type="info" */>}}
{{</* badge content="beta" type="warning" */>}}
{{</* badge content="deprecated" type="error" */>}}
{{</* badge content="tag" */>}}
````{{< badge content="stable" type="info" >}}
{{< badge content="beta" type="warning" >}}
{{< badge content="deprecated" type="error" >}}
{{< badge content="tag" >}}## 美人鱼图````markdown
```美人鱼
 图LR
 A[写注释] --> B[brain_on.sh 检测到变化]
 B --> C[git 提交 + 推送]
 C --> D[GitHub Actions 构建]
 D --> E[在 GitHub 页面上直播]```
```````mermaid
graph LR
    A[Write note] --> B[brain_on.sh detects change]
    B --> C[git commit + push]
    C --> D[GitHub Actions builds]
    D --> E[Live on GitHub Pages]
```

````markdown
```美人鱼
 序列图
 客户端->>服务器： GET /api/notes
 服务器-->>客户端：200 OK + JSON```
```````mermaid
sequenceDiagram
    Client->>Server: GET /api/notes
    Server-->>Client: 200 OK + JSON
```## KaTeX 数学

 内联：```markdown
$E = mc^2$
```

$E = mc^2$块（居中）：```markdown
$$
\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$
```

$$
\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$## 代码块````markdown
```去
 包主

 导入“fmt”

 函数主() {
 fmt.Println(“你好，大脑”)
 }```
```````go
package main

import "fmt"

func main() {
    fmt.Println("hello, brain")
}
```

```python
def greet(name: str) -> str:
    return f"hello, {name}"
```

```sql
SELECT title, date
FROM notes
WHERE tags @> ARRAY['go']
ORDER BY date DESC;
```

```bash
hugo server --buildDrafts --buildFuture
```## Markdown 快速参考

 ### 文字

 | 语法 | 结果 |
 |--------|--------|
 |`**bold**`| **粗体** |
 |`*italic*`| *斜体* |
 | `` `代码` `` | `代码` |
 |`~~strike~~`| ~~罢工~~ |

 ### 链接```markdown
[external](https://gohugo.io)
[internal]({{</* relref "cheatsheet.md" */>}})
```[外部](https://gohugo.io)

 ### 任务列表```markdown
- [x] Published cheatsheet
- [x] Added dark mode toggle
- [ ] Write more notes
```- [x] 已发布的备忘单
 - [x] 添加了暗模式切换
 - [ ] 写更多笔记

 ### 表```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| a    |   b    |     c |
| 1    |   2    |     3 |
```| 左| 中心| 对|
 |:-----|:------:|------:|
 | 一个 | 乙| c |
 | 1 | 2 | 3 |

 ### 脚注```markdown
This is a claim.[^source]

[^source]: The source for this claim.
```这是一个声明。[^来源]

 [^来源]：此声明的来源。 
## 前面的内容参考```yaml
title: "Note title"
date: 2026-05-02
weight: 1                    # sidebar order, lower = higher
tags: ["go", "db"]
draft: false

math: true                   # enable KaTeX on this page
```
